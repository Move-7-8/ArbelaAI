import { connectToDB } from "@utils/database";
import pdf from "@models/pdf"; // Make sure the path is correct


export const GET = async (request) => {
    try {
        console.log("Connecting to DB Check...");
        await connectToDB();
        console.log("Connected to DB Check.");

        // Getting url from the query string
        const url = request.url;
        console.log("Full Received Request URL:", url);
        const queryParams = new URLSearchParams(url.split('?')[1]);
        const pdfUrl = queryParams.get('url');

        console.log("Decoded PDF URL:", decodeURIComponent(pdfUrl));
       
        // Getting if PDF URL already exists in the DB
        console.log("Checking if PDF already exists in the database...");
        const existingPdf = await pdf.findOne({ url: pdfUrl });
        
        if (existingPdf) {
            console.log("PDF already exists in the database.");
            return new Response(JSON.stringify({ exists: true, docId: existingPdf.docId }), { status: 200 });
        } else {
            console.log("PDF does not exist in the database.");
            return new Response(JSON.stringify({ exists: false, docId: null }), { status: 200 });
        }
    } catch (error) {
        console.error("Error Details:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};


export const POST = async (request) => {

    try {
        const requestBody = await request.json();
        const { pdfUrl, company, statementType } = requestBody;

        // STEP 1: Sending PDF URL to third-party API for a doc ID
        console.log('Sending request with body:', JSON.stringify(pdfUrl));

        const askYourPdfUploadUrl = 'https://api.askyourpdf.com/v1/api/download_pdf';
        const AskYourPDFApiKey = 'ask_ff52ea5e1feb49aad44a295af3218d74';
        const headers = {
            'x-api-key': AskYourPDFApiKey
        }
        const response = await fetch(askYourPdfUploadUrl + `?url=${encodeURIComponent(pdfUrl)}`, {
            method: 'GET',
            headers: headers,
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error uploading PDF:', errorText);
            return new Response(JSON.stringify({ error: errorText }), { status: response.status });
        }

        const data = await response.json();
        const docId = data.docId; // Assuming the doc ID is located in the id field of the response
        console.log('DATA RETURN:', data);

        console.log('DOC ID RETURN:', docId);

        // STEP 2: Checking if the PDF already exists in our database
        console.log("Connecting to DB Upload...");
        await connectToDB();
        console.log("Connected to DB Upload.");

        console.log("Checking if PDF already exists in the database...");
        const existingPdf = await pdf.findOne({ url: pdfUrl });

        if (existingPdf) {
            console.log("PDF already exists in the database.");
            return new Response(JSON.stringify({ exists: true, docId: existingPdf.docId  }), { status: 200 });

        // STEP 3: Uploading the PDF if it is new

        } else {
            console.log("PDF does not exist. Saving new PDF info to the database.");
            const newPdf = new pdf({
                url: pdfUrl,
                company: company, 
                statementType: statementType,
                docId: docId
            });

            await newPdf.save();
            console.log("Saved new PDF info to the database.");
            return new Response(JSON.stringify({ exists: false, docId: docId }), { status: 200 });
        }

    } catch (error) {
        console.error('Error Details:', error);
        return new Response(JSON.stringify({ exists: false }), { status: 200 });
    }
};






//     try {
//         const requestBody = await request.json();
//         const { pdfUrl } = requestBody;

//         const pdfAiUploadUrl = 'https://pdf.ai/api/v1/upload/url';
//         const pdfAiApiKey = 'bxh7c609xu51wo12yyj70fyv';
  
//         console.log('Sending request with body:', JSON.stringify(pdfUrl));
        
//         const response = await fetch(pdfAiUploadUrl, {
//           // mode: 'no-cors',
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-API-Key': pdfAiApiKey
//           },
//         //   body: JSON.stringify(requestBody)
//             body: JSON.stringify({ url: pdfUrl })

//         });
        
//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('Error uploading PDF:', errorText);
//             return new Response(JSON.stringify({ error: errorText }), { status: response.status });
//         }

//         const data = await response.json();
//         console.log('PDF uploaded successfully:', data);
//         return new Response(JSON.stringify(data), { status: 200 }); // Returning the data directly
//       } catch (error) {
//         console.error('Error uploading PDF:', error);
//       }
//     }


// // OLD CODE
// // export const POST = async (request, { params }) => {
//     try {
//         console.log("Connecting to DB..."); // Log before attempting to connect to the database
//         await connectToDB(); 
//         console.log("Connected to DB."); // Log after successfully connecting to the database

//         const { url, company, statementType, docId } = await request.json(); 
//         console.log("Received Request:", { url, company, statementType }); // Log the received request body

//         console.log("Checking if PDF already exists in the database...");
//         const existingPdf = await pdf.findOne({ url });

//         if (existingPdf) {
//             console.log("PDF already exists in the database."); // Log if PDF already exists
//             return new Response(JSON.stringify({ exists: true }), { status: 200 });
//         } else {
//             console.log("PDF does not exist. Saving new PDF info to the database."); // Log if PDF does not exist
//             const newPdf = new pdf({
//                 url,
//                 company,
//                 statementType,
//                 docId 

//             });
            
//             await newPdf.save();
//             console.log("Saved new PDF info to the database."); // Log after saving new PDF info
//             return new Response(JSON.stringify({ exists: false }), { status: 200 });
//         }
//     } catch (error) {
//         console.error("Error Details:", error); // Log detailed error message
//         return new Response("Internal Server Error", { status: 500 });
//     }
// // };
