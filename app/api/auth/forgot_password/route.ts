import { NextRequest, NextResponse } from "next/server";
import client from '../../db'; 

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email } = await req.json();

        // Input validation
        if ( !email ) {
            return NextResponse.json({ message: "All fields, including userId, are required." }, { status: 400 });
        }

        // Check if user exists
        const checkUserSql = `SELECT * FROM users WHERE email = $1`;
        const userResult = await client.query(checkUserSql, [email]);

      
        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "Invalid email" }, { status: 404 });
        }

        // Update user profile
        const updateUserSql = `
            UPDATE users
            SET verification_code = $1, updated_at = NOW()
            WHERE email = $2
            RETURNING *
        `;
        const verification_code = generateVerificationCode();
        const updateValues = [ verification_code, email ];
        const updateResult = await client.query(updateUserSql, updateValues);

      //  await sendVerificationCodeEmail(email, userResult.rows[0].first_name, verification_code);

        return NextResponse.json({ message: "Verification sent!", user: updateResult.rows[0] }, { status: 200 });
    } catch (error) {
        console.error("Error during profile update:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
