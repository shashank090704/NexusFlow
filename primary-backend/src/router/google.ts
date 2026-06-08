import { prisma } from "@repo/db";
import { decodeIdToken, generateCodeVerifier, generateState, Google } from "arctic";
import { CookieOptions, Router } from "express";
import flash from "express-flash";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import crypto from "crypto"
import "dotenv/config";


const router = Router()
router.use(flash());

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!, // this is your apps public ID by which google knows which app is trying to login
  process.env.GOOGLE_CLIENT_SECRET!, // apps secret key shown by backend to google
  process.env.GOOGLE_REDIRECT_URI! // after successfull login with google , google will send them a special code to this URL
    // we will create this route to verify after login
);

// 1. Prepare your "Master Key" (The password for your safe)
const algorithm = 'aes-256-cbc'; 

if (!process.env.ENCRYPTION_SECRET_KEY) {
  throw new Error("ENCRYPTION_SECRET_KEY not set");
}

const secretKey = Buffer.from(
  process.env.ENCRYPTION_SECRET_KEY,
  "hex"
);

if (secretKey.length !== 32) {
  throw new Error("Encryption key must be 32 bytes (256-bit)");
}

function lockToken(plainToken) {
    // 2. Generate a "One-Time Lock" (The IV)
    // Even if you lock the same token twice, a new IV makes it look different 
    // to hackers.
    const iv = crypto.randomBytes(16);

    // 3. Create the "Cipher" (The machine that does the scrambling)
    const cipher = crypto.createCipheriv(
        algorithm, 
        (secretKey as unknown) as crypto.BinaryLike, 
        (iv as unknown) as crypto.BinaryLike
    );
    // 4. Scramble the token
    let encrypted = cipher.update(plainToken, 'utf8', 'hex'); // Start scrambling
    encrypted += cipher.final('hex'); // Finish scrambling

    // 5. Output the result
    // You MUST save BOTH 'iv' and 'encrypted' in your database. 
    // You cannot unlock the suitcase without knowing WHICH unique lock (IV) you used.
    return { 
        iv: iv.toString('hex'), 
        encryptedData: encrypted 
    };
}


router.get("/",async (req,res)=>{

    //@ts-ignore
    if(req.id) return res.redirect("/");

    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid", // openid will give us token
        "profile", // will give us name profile
        "email",
       "https://www.googleapis.com/auth/spreadsheets"
    ]
);


    const isProduction = process.env.NODE_ENV === "production";
    const cookieConfig : CookieOptions = {
        httpOnly:true,
        secure: isProduction,
        maxAge : 24 * 60 * 60 * 1000,
        sameSite: isProduction ? "none" : "lax", // this is for when google redirects to our site cookies maintained
    };

    res.cookie("google_oauth_state",state,cookieConfig);
    res.cookie("google_code_verifier", codeVerifier,cookieConfig)

    url.searchParams.set("prompt", "consent");
    url.searchParams.set("access_type", "offline");

    res.redirect(url.toString());

})

router.get("/callback",async (req,res)=>{

    // google redirects with code, ans state in query params
    // we will use code to find out user

    const {code,state} = req.query;

    if (typeof code !== "string" || typeof state !== "string") {
        return res.status(400).send("Invalid OAuth callback params");
    }

    console.log(code,state);

    const {
        google_oauth_state:storedState,
        google_code_verifier:codeVerifier,
    } = req.cookies


    if(!code || !state|| !storedState || !codeVerifier || state!==storedState ){
        req.flash("errors","Couldn't login with Google because of invalid login attempt. Please try again!")
        return res.redirect("/api/signup");
    }

    let tokens;

    try{
        tokens=await google.validateAuthorizationCode(code,codeVerifier);
        // this token have access_token , refresh_token, id_token
    }
    catch{
        req.flash("errors","Couldn't login with Google because of invalid login attempt. Please try again!")
        return res.redirect("/api/signup");
    }

    console.log("token google: ", tokens);

    type GoogleIdTokenClaims = {
        sub: string;
        email: string;
        name?: string;
        email_verified?: boolean;
        picture?: string;
    };

    const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenClaims;

    const {sub : googleUserId ,name,email} = claims;

    // if the user already exists with google oauth linked
    // means user already linked google email
    let user =await prisma.user.findFirst({
        where:{
            email:email
        },
        select:{
            id :true,
            name :true,
            email:true,
            oAuth:{
                where:{
                    provider:"google",
                },
                select :{
                    providerAccountId: true,
                    provider:true
                }
            }
        }

        
    })

    //user already exists with the same emial but google oauth is not linked
    /*if(user && !user.providerAccountId){
        
        await prisma.oauth_accounts.create({
            data:{
                userId : user.id,
                provider:"google",
                providerAccountId : googleUserId
            }
        })
    }*/
    
    // user doesn't exists
    if(!user){
        if(!name){
            req.flash("errors","Couldn't login with Google because of invalid login attempt. Name not found .Please try again!")
            return res.redirect("/api/signup");
        }
        // await prisma.$transaction(async (tx)=>{

            user= await prisma.user.create({
                data:{
                    email,
                    name ,
                    password:""
                },
                include: {
                    oAuth: true // This satisfies the TypeScript requirement for the 'oAuth' property
                }
            })

         /*   await prisma.oauth_accounts.create({
                provider:"google",
                providerAccountId : googleUserId,
                userId:user.id
            })
        })*/
    }
    if(!user){   
        req.flash("errors","Couldn't login with Google because of invalid login attempt. Please try again!")
        return res.redirect("/api/signup");
    }

    const expiresAt = new Date(Date.now() + tokens.accessTokenExpiresInSeconds()*1000)
    const newRefreshToken = tokens.refreshToken();
    const access_token = tokens.accessToken();

    const hashedAccessToken = lockToken(access_token)
    const hashedRefreshToken = newRefreshToken ? lockToken(newRefreshToken) : null;

    await prisma.oauth_accounts.upsert({
        where:{
            // below is we are using composite primary key
            provider_providerAccountId: {
                provider: "google",
                providerAccountId: googleUserId,
            },
        },
        update:{
            accessToken: hashedAccessToken.encryptedData,
            ...(hashedRefreshToken && { refreshToken: hashedRefreshToken.encryptedData }),
            expiresAt,
            accessTokenIv:hashedAccessToken.iv,
            ...(hashedRefreshToken?.iv && { refreshTokenIv: hashedRefreshToken.iv }),
        },
        create:{
            userId:user.id,
            provider:"google",
            providerAccountId: googleUserId,
            accessToken: hashedAccessToken.encryptedData,
            refreshToken: hashedRefreshToken?.encryptedData || "",
            accessTokenIv:hashedAccessToken.iv,
            refreshTokenIv:hashedRefreshToken?.iv || "",
            expiresAt,
        }
    })

    const authToken = jwt.sign({
        id:user.id
    },JWT_PASSWORD)

    // store authToken in browser
    //localStorage.setItem("authToken", authToken);

    const isProduction = process.env.NODE_ENV === "production";
        res.cookie("auth_token", authToken, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, 
        });


        // Node.js will now use whatever URL you put in your .env
        res.redirect(`${process.env.FRONTEND_URL}/zaps/`);

})


export const getGoogleLoginPage= router;