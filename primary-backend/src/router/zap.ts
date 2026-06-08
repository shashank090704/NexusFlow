import Router from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { ZapCreateSchema } from "../types";
import { prisma ,type Zap ,Prisma} from "@repo/db";
import { parseGithubData } from "../parser/parser";


const router = Router();



router.post("/",authMiddleware,async (req,res)=>{
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message:"Invalid Input"
        })
    }
    //@ts-ignore
    const userId = req.id;
    
    const zapId = await prisma.$transaction(async (tx : Prisma.TransactionClient)=>{
        const newzap= await tx.zap.create({
            data :{
                userId : userId
            }
        })

        await tx.trigger.create({
            data :{
                zapId: newzap.id,
                availTriggerId : parsedData.data.availtriggerId,
                triggerMetadata : parsedData.data.triggerMetadata
            }
        })

        // for Each does not support async tasks means it does not wait for the actions to create
        await Promise.all(
        parsedData.data.actions.map( async (element,idx) => {
            await tx.action.create({
                data :{
                    zapId: newzap.id,
                    availActionId : element.availActionId,
                    actionMetadata : element.actionMetadata,
                    sortingOrder :idx
                }
            })
        }));

    })
    
    return res.json({zapId})

    res.send("create a zap")
})

router.get("/",authMiddleware,async (req,res)=>{

     //@ts-ignore
    const userId = req.id;

    // we have manually include the relations they are not autofetched and used nested inlcude to go realtion to relation
    const zaps = await  prisma.zap.findMany({
        where:{
            userId : userId
        },
        include:{
            actions:{
                include :{
                    type:true
                }
            },
            trigger:{
                include :{
                    type:true
                }
            },
            zapRuns:true
            
        }
    })
    
    return res.json({zaps})
})

router.get("/available", authMiddleware,async (req,res)=>{
    const triggers=await prisma.availiableTrigger.findMany({})
    const actions=await prisma.availiableAction.findMany({})

    //console.log(triggers)
    res.json({
        triggers,
        actions
    })

})

router.get<{ zapId: string }>("/:zapId",authMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId = req.id;
    
    const zapId = req.params.zapId ; //<{ zapId: string }> this is necessary while using params other wise type error b/c they can be undefined

    const zap = await prisma.zap.findFirst({
        where:{
            id: zapId,
            userId:userId
        },
        include:{
            actions:{
                include :{
                    type:true
                }
            },
            trigger:{
                include :{
                    type:true
                }
            },
            zapRuns:true
            
        }

        
    })

     const zapRuns = zap?.zapRuns;
     let zapRunMetadata;
    if(zapRuns){
        zapRunMetadata = await Promise.all(
            zapRuns.map(async (element) => {
                const data = await parseGithubData(element.matadata);
                return data.comment;
            })
        );
    }
    
    
    return res.json({zap,zapRunMetadata});
})



export const zapRouter = router