import { NextResponse, NextRequest } from 'next/server';
import client from "../../db"; // Adjust path accordingly
import { sendActivityEmail } from '../../utils/config';

export async function POST(req: NextRequest) {
    try {
        const { userInput, orderId } = await req.json();

        if (!userInput || !orderId) {
            return NextResponse.json({ message: "User ID or Email and Order ID are required" }, { status: 400 });
        }

        // Check if input is a valid email or user ID
        const userQuery = await client.query(
            "SELECT * FROM users WHERE  email = $1",
            [userInput]
        );

        if (userQuery.rowCount === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userQuery.rows[0].id;

        const name= userQuery.rows[0].first_name;

        const checkMatch = await client.query('SELECT * FROM orders WHERE order_number = $1 AND user_id = $2', [orderId, userId]);

        if(checkMatch.rowCount === 0){
            return NextResponse.json({ message: "Invalid identifier" }, { status: 404 });
        }
        // Update orders and delivery status
        await client.query(
            "UPDATE orders SET status='Delivered' WHERE order_number = $1 AND user_id = $2",
            [orderId, userId]
        );

        await client.query(
            "UPDATE delivery SET status='Active' WHERE order_number = $1 ",
            [orderId]
        );
        const message = `Your order [${orderId}] has finilized successfully. Thank you for shopping with us!`;
        const subject = "BIA order delivery updates";

        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'false', 'false', NOW())`;
        await client.query(notification, [message, userId, "Updates", "true", "Unread", `/dash/profile`, "Unread"])

        await sendActivityEmail(userInput, name, message, subject);

        return NextResponse.json({ message: "Order finalized successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error occurred, try again"+error, error: (error as Error).message }, { status: 500 });
    }
}
