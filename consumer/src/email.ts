const Brevo = require('@getbrevo/brevo');
let apiInstance = new Brevo.TransactionalEmailsApi();

// Authenticate with your API Key
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

let sendSmtpEmail = new Brevo.SendSmtpEmail();

sendSmtpEmail.subject = "Hello from team flowEngine";

sendSmtpEmail.sender = { "name": "flowEngine", "email": "abhay012k25@gmail.com" };


export async function sendMail(to :string,body :string) {
    try {
        sendSmtpEmail.to = [{ "email": `${to}`, "name": "Abhay Jadon" }];
        sendSmtpEmail.htmlContent = `<html><body><h1>${body}</h1></body></html>`;
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
}

