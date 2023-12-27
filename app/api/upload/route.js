export async function POST(req) {
    console.log('backend Firing');
    try {
        // Use a Promise to handle the asynchronous timeout
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('File Uploaded');

        // Return a Response object directly, rather than from within the setTimeout
        return new Response(JSON.stringify({ result: true, msg: "File Uploaded" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json" // Ensure to set the Content-Type header for JSON response
            }
        });
    } catch (error) {
        console.error('Error in POST:', error); // Log the error for debugging purposes
        return new Response(JSON.stringify("Failed to POST"), { status: 500 });
    }
}

export async function DELETE(req, res) {
    try {
        console.log('File Deleted');
        return new Response(JSON.stringify({ result: true, msg: "File Deleted" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json" // Ensure to set the Content-Type header for JSON response
            }
        });
    } catch (error) {
        console.error('Error in DELETE:', error); // Log the error for debugging purposes
        return new Response(JSON.stringify("Failed to DELETE"), { status: 500 });
    }
}
