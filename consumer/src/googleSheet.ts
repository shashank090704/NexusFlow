import { prisma } from "@repo/db"
import axios from "axios"
import * as crypto from "crypto"


const algorithm = 'aes-256-cbc' ; 

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

async function unlockToken(storedIv: string, storedEncryptedData: string) {
    // 1. Convert the saved database strings back into usable "Binary Buffers"
    const ivBuffer = Buffer.from(storedIv, 'hex');
    
    // 2. Prepare the "Un-scrambler" (Decipher)
    // It needs the same algorithm, your Master Key, and the specific IV you saved.
    const decipher = crypto.createDecipheriv(
        algorithm, 
        (secretKey as unknown) as crypto.BinaryLike, 
        (ivBuffer as unknown) as crypto.BinaryLike
    );

    // 3. Un-scramble the data
    let decrypted = decipher.update(storedEncryptedData, 'hex', 'utf8'); // Start un-scrambling
    decrypted += decipher.final('utf8'); // Finish un-scrambling

    return decrypted; // This is your original token! 
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


export const appendRowToSheet = async (userId:number, sheetId:string,sheetName: string,values : any[])=>{

    const account = await prisma.oauth_accounts.findFirst({
        where:{
            userId,
            provider:"google"
        }
    })
    //console.log(account)

    if(!account || !account.accessToken){
        throw new Error("Google account not linked.");
    }
    
    const hashedToken = account.accessToken;
    const tokenIv = account.accessTokenIv;
    if(!tokenIv){
         throw new Error("Hashing key not found");
    }


    const token = await unlockToken(tokenIv,hashedToken);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`;

    try{
        return await sendRequest(url,token,values);

    }
    catch(error:any){
        if(!account || !account.refreshToken){
            throw new Error("Google account not linked.");
        }
        
        const hashedRefreshToken = account.refreshToken;
        const refreshTokenIv = account.refreshTokenIv;
        if(!refreshTokenIv){
            throw new Error("Hashing key not found");
        }


        const token = await unlockToken(refreshTokenIv,hashedRefreshToken);
        if(error.response?.status === 401 && account.refreshToken){
            const newToken = await refreshGoogleToken(userId,token);
            return await sendRequest(url,newToken,values);

        }
        throw error
    }

}

const sendRequest = async (url : string,token:string,values:any[])=>{
    return await axios.post(url,{
        majorDimension:"ROWS",
        values:[values]
    },{
        headers:{Authorization: `Bearer ${token}`}
    })
}

async function refreshGoogleToken(userId:number,refreshToken:string){

    const response = await axios.post("https://oauth2.googleapis.com/token",{
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token:refreshToken,
        grant_type:"refresh_token",
    });

    const {access_token,expires_in} = response.data;

    const locked = lockToken(access_token);


    await prisma.oauth_accounts.updateMany({
        where:{
            userId,
            provider:"google"
        },
        data:{
            accessToken:locked.encryptedData,
            accessTokenIv:locked.iv,
            expiresAt : new Date(Date.now() + expires_in*1000)
            //expiresAt : new Date(Math.floor(Date.now() / 1000) + expires_at)
        }
    })

    return access_token;
}