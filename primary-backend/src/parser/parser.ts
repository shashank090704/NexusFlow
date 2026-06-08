import { Prisma } from ".prisma/client";


export async function parseGithubData(zapRunMetadata:any){
    
                const pull_request = zapRunMetadata?.pull_request as Prisma.JsonObject;
                //console.log(pull_request.body,typeof(pull_request.body))
                let body =  pull_request.body as string;

               //console.log(body,typeof(body),44)
                const label = pull_request?.labels as Prisma.JsonObject;
                
                const label1 = label[0] as Prisma.JsonObject;
                const amount = label1.name as string;
                    //console.log(amount,typeof(amount))
                body=body+"/"+amount;
                //console.log(body);
    
                const extractData = (text: string = "") => {
                    const findValue = (key: string): string => {
                        // Updated Regex:
                        // key        -> "amount"
                        // \\s* -> handles space BEFORE colon (e.g., "amount :")
                        // :          -> matches the colon
                        // \\s* -> handles space AFTER colon (e.g., ": 5")
                        // ([^/\n$]+) -> captures until / or newline or end
                        const regex = new RegExp(`${key}\\s*:\\s*([^/\\r\\n$]+)`, 'i');
                        return text.match(regex)?.[1]?.trim() ?? "";
                    };
    
                    const amountValue = findValue("amount");
    
                    return {comment :{
                        email: findValue("email"),
                        address: findValue("address"),
                        // Number() returns 0 if findValue returns "" (empty string)
                        // We log it here to debug
                        amount: Number(amountValue) || 0 
                    }};
                };
                const zapData = extractData(body); 
                return zapData;
                // Now you can use it freely without "null" checks
}