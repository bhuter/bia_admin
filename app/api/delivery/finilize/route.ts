import { NextResponse, NextRequest } from 'next/server';
import client from "../../db"; // Adjust path accordingly

export async function POST(req: NextRequest) {
    try {
        const { userInput, orderId } = await req.json();

        if (!userInput || !orderId) {
            return NextResponse.json({ message: "User ID or Email and Order ID are required" }, { status: 400 });
        }
        console.log("user: "+userInput, " order: "+orderId)
        // Check if input is a valid email or user ID
        const userQuery = await client.query(
            "SELECT id FROM users WHERE  email = $1",
            [userInput]
        );

        if (userQuery.rowCount === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userQuery.rows[0].id;

        // Update orders and delivery status
        await client.query(
            "UPDATE orders SET status='Delivered' WHERE order_number = $1 AND CAST(user_id AS TEXT) = $2",
            [orderId, userId]
        );

        await client.query(
            "UPDATE delivery SET status='Active' WHERE order_number = $1 ",
            [orderId]
        );

        return NextResponse.json({ message: "Order finalized successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error occurred, try again"+error, error: (error as Error).message }, { status: 500 });
    }
}
