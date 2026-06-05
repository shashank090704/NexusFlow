import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../config";
import jwt  from "jsonwebtoken";
import express from "express";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());

export const authMiddleware =((req: Request,res:Response,next:NextFunction)=>{
    //const token = req.headers.authorization as unknown as string; // this is for type error se bachne se liye
    const token = req.cookies?.auth_token;
    //console.log(token);
    if (!token) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }
    try {
        const payload = jwt.verify(token,JWT_PASSWORD);

        //@ts-ignore
        req.id = payload.id
        next()
    }
    catch(e){
        return res.status(403).json({
            message : "You are not logged in"
        })
    }
})