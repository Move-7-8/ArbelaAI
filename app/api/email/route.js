const mail = require('@sendgrid/mail');
mail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req, res) {
    if (req.method === 'POST') {
        const request = await req.json();
        console.log('Backend email request:', request)
        // const req_data = request.Request;
        // console.log('Req Name:', request.name);
        if (!request.name || !request.email || !request.subject || !request.message) {
            return Response.json({ message: 'Bad request' })

        }

        const message = `
        Name: ${request.name}\r\n
        Email: ${request.email}\r\n
        Subject: ${request.subject}\r\n
        Message: ${request.message}
        `
        const data = {
            to: 'connor@kalicapital.io',
            from: 'info@arbela.io',
            subject: request.subject,
            text: message, 
            html: message.replace(/\r\n/g, '<br>')
        }

        mail.send(data);

        return Response.json({ message: 'Message received successfully!' })
    } else {
        return Response.json({ error: e })

    }
}






// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// });

// const mailOptions = {
//     from: email, 
//     to: email, 

// }

// try {
//     await transporter.sendMail({
//         ...mailOptions,
//         subject: data.subject,
//         text: 'This a test string', 
//         html: `<h1>Test Title </h1> <p>Some body text</p>`
//     });

// } catch {
//     console.log(error)
//     return Response.json({ message: error.message })

// }
