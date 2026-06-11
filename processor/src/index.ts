import { prisma } from "@repo/db"
import { Kafka } from "kafkajs"

const kafka = new Kafka({
  clientId: "outbox-processor", // name
  brokers: [process.env.KAFKA_BROKER || "localhost:9094"] // where it is running
})

const TOPIC_NAME='zap-events'

const main =async function(){

    const producer = kafka.producer();
    await producer.connect()

    while(1){

         

        //fetching from db

        const pendingRows = await prisma.zapRunOutbox.findMany({
            take:10
        })
        

        // putting into queue

        await producer.send({
            topic:TOPIC_NAME,
            messages : pendingRows.map(r =>{
                console.log(r.zapRunId)
                return { value : JSON.stringify({zapRunId: r.zapRunId,stage:0}  )} 
            })
        })

        //delete from db

        await prisma.zapRunOutbox.deleteMany({
            where :{
                id :{
                    in: pendingRows.map((r)=>(
                        r.id
                    ))
                }
            }
        })


    }

}

main()