import { 
    Connection, 
    Keypair, 
    PublicKey, 
    SystemProgram, 
    Transaction, 
    sendAndConfirmTransaction, 
    LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import bs58 from 'bs58';

export async function sendSol(senderKey:string,amount:string,addressTo:string){
    try{
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        // this creates connection to blockchain
        console.log(senderKey)
        const secretKey = bs58.decode(senderKey);
        const senderKeypair = Keypair.fromSecretKey(secretKey)

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey:senderKeypair.publicKey,
                toPubkey: new PublicKey(addressTo),
                lamports: Number(amount) * LAMPORTS_PER_SOL,
            })
        )

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [senderKeypair]
        )

        return signature;
    }
    catch(error){
        console.error("❌ Solana Action Failed:", error);
        throw error;
    }
}