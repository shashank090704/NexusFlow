import {Router} from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { SigninSchema, SignupSchema } from "../types";
import {prisma} from "@repo/db"
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import flash from "express-flash";
import { use } from "react";
const bcrypt = require('bcrypt')

const router = Router();
router.use(flash());

router.post("/signup",async (req,res)=>{

    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if(!parsedData.success){

        return res.status(411).json({
            message:"Incorrect inputs",
            errors: parsedData.error,
        })
    }

    const userExists = await prisma.user.findFirst({
        where:{
            email: parsedData.data.email
        },
        
    })

    if(userExists && userExists.password){
        return res.status(403).json({
            message:"user Already Exists"
        })
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password,10)

    await prisma.user.create({
        data:{
            name : parsedData.data.name,
            email : parsedData.data.email,
            // dont store passwords in plain text , hash it
            password : hashedPassword,
        }
    })

    // await sendEmail();
    return res.json({
        message : "Please verify your Account by checking your email"
    })

    console.log("signup handler")
})

router.post("/signin",async (req,res)=>{

    const body = req.body;

    const parsedData = SigninSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message: "Incorrect Inputs or may be You have created account using google login. Please login with google or Signup"
        })
    }

    if(!parsedData.data.password){
        return res.status(403).json({ message: "Incorrect Inputs or may be You have created account using google login. Please login with google or Signup"})
        //return res.redirect("/signin")
    }

    const user = await prisma.user.findFirst({
        where:{
            email: parsedData.data.email,
        }
    })

    const isMatch = await bcrypt.compare(parsedData.data.password,user?.password)

    if(!user || !isMatch){
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }

    // jwt auth

    const authToken = jwt.sign({
            id:user.id
        },JWT_PASSWORD)
        
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("auth_token", authToken, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });
    
        //res.redirect("http://localhost:3000/");
        return res.json({ 
            success: true, 
            message: "Login successful", 
        });

    /*return res.json({
        token:token
    })*/

    //console.log("signuphandler")
})

router.get("/", authMiddleware,async (req,res)=>{
    //To-do fix the type
    //@ts-ignore
    const id = req.id;

    const user = await prisma.user.findFirst({
        where:{
            id
        },
        select:{
            email : true,
            name:true
        }
    })

    return res.json({
        user
    })

})

router.post("/logout", authMiddleware,async (req,res)=>{
    //To-do fix the type
    //@ts-ignore
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax", // Must match what you used in res.cookie
        secure: process.env.NODE_ENV === "production", 
        path: "/" // Ensure path matches (default is usually "/")
    });

    return res.status(200).json({message:"Logged out"})

})



export const userRouter=router;
