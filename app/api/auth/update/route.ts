import { NextRequest, NextResponse } from "next/server";
import client from '../../db'; // Assuming client is a PostgreSQL client instance
import { sendAccountUpdate } from "../../utils/config";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { userId, firstName, lastName, email, phone, nationality } = await req.json();

        // Input validation
        if (!userId || !firstName || !lastName || !email || !phone || !nationality) {
            return NextResponse.json({ message: "All fields, including userId, are required." }, { status: 400 });
        }

        // Check if user exists
        const checkUserSql = `SELECT * FROM users WHERE id = $1`;
        const userResult = await client.query(checkUserSql, [userId]);
    
        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Update user profile
        const updateUserSql = `
            UPDATE users
            SET first_name = $1, last_name = $2, email = $3, phone = $4, nationality = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING *
        `;
        const updateValues = [firstName, lastName, email, phone, nationality, userId];
        const updateResult = await client.query(updateUserSql, updateValues);

        if (updateResult.rowCount === 0) {
            return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
        }

        let deviceInfo = 'unknown device';
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
          deviceInfo = `${navigator.platform}, ${navigator.userAgent}`;
        }
        const message = `Your profile has been changed. Done at${(new Date()).toLocaleString()} from device: ${deviceInfo}. \nIf it was not you please let's know at support@biafricantouch.com`;
        
        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'yes', 'no', NOW())`;
        await client.query(notification, [message, userId, "Security and Privacy", "true", "Unread", `/dash/profile`, "Unread"])
       
        return NextResponse.json({ message: "Profile updated successfully!", user: updateResult.rows[0] }, { status: 200 });
    } catch (error) {
        console.error("Error during profile update:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
