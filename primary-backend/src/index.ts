import express from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from "cors"
import { getGoogleLoginPage } from "./router/google";
import { authMiddleware } from "./middleware/authMiddleware";
import { prisma } from "@repo/db";
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(cors(
    {
    // 1. Specify exactly which origin is allowed
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    // 2. Allow cookies to be sent/received
    credentials: true,
    // 3. (Optional) Specify allowed methods
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}
))



app.use("/api/user",userRouter);

app.use("/api/zap",zapRouter);

app.use("/api/google",getGoogleLoginPage)

app.get("/api/me", authMiddleware, async (req , res)=>{
    const userId = (req as any).id;

    const user = await prisma.user.findUnique({
        where: {id:userId},
        select:{
            id:true,
            email:true,
            name:true,
            oAuth:{
                select:{
                    provider:true,
                }
            }
        }
    })

    res.json(user);
})


app.listen(5000)
