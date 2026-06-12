import {Kafka} from "kafkajs";
import {prisma ,Prisma} from "@repo/db"
import  parseMetadata  from "./parser";
import { sendMail } from "./email";
import { sendSol } from "./solana";
import { appendRowToSheet } from "./googleSheet";
import { parse } from "url";
import { parseGithubData } from "./githubParser";

const kafka = new Kafka({
  clientId: "outbox-processor", // name
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"] // where it is running
})

const TOPIC_NAME='zap-events'
const  consumer = kafka.consumer({groupId:"main-worker"})
const producer = kafka.producer();

const main = async ()=>{

    await consumer.connect();
    await producer.connect();

    // subscribing to the queue so that all messages that been pushed in the queue come here
    await consumer.subscribe({topic:TOPIC_NAME , fromBeginning:true})

    //running worker over the queue
    await consumer.run({
        autoCommit:false, // this make the auto ack false ki like it will not marked processed until we say
        

        eachMessage : async ({partition,topic,message})=>{

            console.log({
                partition,
                offset:message.offset,
                value:message.value?.toString()
            })
            if(!message.value?.toString()){
                return;
            }

            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;//it represents ham konsa action execute karenge of that zap jiski zap run id hai


            const zapRunDetails = await prisma.zapRun.findFirst({
                where:{
                    id:zapRunId
                },
                include:{
                    zap : {
                        include:{
                            actions:{
                                where:{
                                    sortingOrder:stage
                                },
                                include:{
                                    type:true
                                }
                            },
                            _count: {
                                select: { actions: true } // Only fetches the NUMBER of actions
                            }
                        }
                    }
                }
            })
            const action = zapRunDetails?.zap.actions[0];

            if(!action ){
                console.log("no more actions");
                
                return ;
            }

            const zapRunMetadata = zapRunDetails?.matadata as Prisma.JsonObject;
            if(zapRunMetadata.action!=="closed"){
                return;
            }
            
            const comment= await parseGithubData(zapRunMetadata)
            console.log(comment)
            
             
            //console.log(action)
            if(action?.type.id=== "email"){
              const body = ((action.actionMetadata as Prisma.JsonObject)?.body) as string; ///  "Hey buddy you have recieved the bounty of price ${comment.ammount} "
              const to = ((action.actionMetadata as Prisma.JsonObject)?.email) as string; // "comment.email"
              //const zapRunMetadata = zapRunDetails?.matadata;
              //console.log(zapRunMetadata)
              /*"comment" : {
                    "address" : "eeeeeoderswalletaddress",
                    "ammount" : "2",
                    "email":"user email"
                }*/

                const actualTo = parseMetadata(to,comment);
                
                const actualBody = parseMetadata(body,comment)
                console.log(`send eMail to ${actualTo} with the body : ${actualBody}`);
                sendMail(actualTo,actualBody);
            }

            if(action?.type.id=== "solana"){
                const amount = ((action.actionMetadata as Prisma.JsonObject)?.amount) as string;

                const address = ((action.actionMetadata as Prisma.JsonObject)?.address) as string; 
                const senderKey = ((action.actionMetadata as Prisma.JsonObject)?.senderKey) as string; 
                
                const zapRunMetadata = zapRunDetails?.matadata;

  
                const actualAddressTo = parseMetadata(address,comment);
                
                const actualAmount = parseMetadata(amount,comment) 
                console.log(`send solana to ${actualAddressTo} with  amount ${actualAmount}`)
                sendSol(senderKey, actualAmount,actualAddressTo);
                console.log("solana sent");
            }

            if(action?.type.id==="sheet"){
                
                console.log("adding a new entry to the sheet");
                const userId=zapRunDetails?.zap?.userId;
                const zapRunMetadata = zapRunDetails?.matadata;
                const sheetId = ((action.actionMetadata as Prisma.JsonObject)?.sheetId) as string;

                const sheetName = ((action.actionMetadata as Prisma.JsonObject)?.sheetName) as string; 
                const values = ((action.actionMetadata as Prisma.JsonObject)?.values) as string; 
                console.log(values)
                const temp =parseMetadata(values,comment)
                const cleanedString = temp.slice(1, -1);
                const actualArray = cleanedString.split(',');
                console.log(actualArray)
                
                appendRowToSheet(userId,sheetId,sheetName,actualArray)
            }

        
            // faking perfroming task
            await new Promise(r=>setTimeout(r,1000))
            console.log("processing done")

            // returning ack 
            // below is the syntax we have to pass an array of object inside that partition no , topic/queue no , offset index of message

            await consumer.commitOffsets([{
                partition : partition,
                topic :TOPIC_NAME,
                offset : (parseInt(message.offset)+1).toString()
            }])
            // we have to pass ack = offset+1 cause we ( pass the offset we want next in ack)


            if(stage === zapRunDetails.zap._count.actions-1){
                return ;
            }             
            await producer.send({
                topic:TOPIC_NAME,
                messages :[{
                    value: JSON.stringify({zapRunId : zapRunId, stage:stage+1})
                }]
            })

            
        },
    })
}
main()


