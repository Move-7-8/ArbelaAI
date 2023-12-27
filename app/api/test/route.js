// pages/api/test.js
// import { getSession } from "next-auth/react";
import { connectToDB } from '@utils/database';
import { NextResponse } from 'next/server';
import User from '@models/user';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Adjust the size limit as needed
    },
  },
};

export async function POST(req) {
    console.log('backend hit');
    const data = await req.json();
    console.log(data)
    try {

        console.log("ID:", data);


        return NextResponse.json({ message: "User ID logged" });

    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message || 'An error occurred'
        });
    }
}
