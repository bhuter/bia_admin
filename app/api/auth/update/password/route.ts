import { NextRequest, NextResponse } from "next/server";
import client from '../../../db'; 

// Helper function to hash the password using SHA-256
async function hashPassword(password: string): Promise<string> {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { password, email } = await req.json();

        // Input validation
        if (!email || !password ) {
            return NextResponse.json({ message: "All fields, including userId, are required." }, { status: 400 });
        }

        // Check if user exists
        const checkUserSql = `SELECT * FROM users WHERE email = $1`;
        const userResult = await client.query(checkUserSql, [email]);

      
        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }


        // Update user profile
        const updateUserSql = `
            UPDATE users
            SET password = $1, updated_at = NOW()
            WHERE email = $2
            RETURNING *
        `;
        const hashedPassword = await hashPassword(password)
        const updateValues = [ hashedPassword, email];
        const updateResult = await client.query(updateUserSql, updateValues);

        if (updateResult.rowCount === 0) {
            return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
        }
        let deviceInfo = 'unknown device';
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  deviceInfo = `${navigator.platform}, ${navigator.userAgent}`;
}
        const message = `Your password has been changed. Done at${(new Date()).toLocaleString()} from device: ${deviceInfo}. \nIf it was not you please let's know at support@biafricantouch.com`;
        
        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'yes', 'no', NOW())`;
        await client.query(notification, [message, updateResult.rows[0].id, "Security and Privacy", "true", "Unread", `/dash/profile`, "Unread"])

       // await sendAccountPasswordChange(userResult.rows[0].email, userResult.rows[0].first_name);

        return NextResponse.json({ message: "Profile updated successfully!", user: updateResult.rows[0] }, { status: 200 });
    } catch (error) {
        console.error("Error during profile update:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
