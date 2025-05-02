import { NextRequest, NextResponse } from "next/server";
import client from '../../db'; 

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email, verificationCode } = await req.json();

        // Input validation
        console.log("recieved: ", email, verificationCode)
        if (!verificationCode || !email) {
            return NextResponse.json({ message: "All fields, are required." }, { status: 400 });
        }

        // Check if user exists
        const checkUserSql = `SELECT * FROM users WHERE verification_code = $1 AND email = $2`;
        const userResult = await client.query(checkUserSql, [verificationCode, email]);


      
        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "Invalid email" }, { status: 404 });
        }
        const update = `UPDATE users SET status = 'active' WHERE email = $1`;
        await client.query(update, [email]);
        
        return NextResponse.json({message: "Email verified!", status: 200 });
    } catch (error) {
        console.error("Error during profile update:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
