import express from "express";
import {prisma} from "@repo/db";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/hooks/catch/:userId/:zapId", async (req,res)=>{
    
    const userId = req.params.userId;
    const zapId = req.params.zapId;

    /*  bad way to maintain atomicity

    // store a new trigger in the db
    await prisma.zapRun.create({
        data :{
            zapId : zapId
        }
    })

    // push it on to a queue (kafka/redis)
    kafkaPublisher.publish({
        zapId
    })
    */
    console.log(req.body)
    if(req.body.action!=="closed"){
        return;
    }
    await prisma.$transaction(async (tx:any ) =>{

        
        const run = await tx.zapRun.create({
            data:{
                zapId : zapId,
                matadata : req.body
            }
        })


        const res =await tx.zapRunOutbox.create({
            data :{
                zapRunId: run.id
            }
        })

        

    })
    res.json({
        message : "Webhook received"
    })

    
})

app.get("/",(req,res)=>{
    res.send("abhay")
})

app.listen(3001)

