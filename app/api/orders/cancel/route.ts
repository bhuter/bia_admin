import { NextRequest, NextResponse } from 'next/server';
import client from "../../db"; // Adjust the path to your database client

export async function PUT(req: NextRequest): Promise<NextResponse> {
    let requestBody;
      
      // Safe JSON parsing
      try {
          requestBody = await req.json();
      } catch (error) {
          return NextResponse.json({ message: "Invalid JSON format in request." }, { status: 400 });
      }
      const {id} = requestBody;
      
      if (!id) {
          return NextResponse.json({ message: "Order ID is required." }, { status: 400 });
      }

    try {
      let query = `UPDATE orders SET status = 'Canceled' WHERE order_id = $1 RETURNING order_number`;
   
        // Fetch Order details
        const OrderResult = await client.query(query, [id]);

        if (OrderResult.rows.length === 0) {
            return NextResponse.json({ message: "Order not found." }, { status: 404 });
        }
        const message = `Your order [${OrderResult.rows[0].order_number}] has been canceled by admin.`;

        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'false', 'false', NOW())`;
        await client.query(notification, [message, OrderResult.rows[0].user_id, "Updates", "true", "Unread", `/dash/profile`, "Unread"])


        return NextResponse.json(OrderResult.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error retrieving Order:", error);
        return NextResponse.json({ message: "Error retrieving Order", error: (error as Error).message }, { status: 500 });
    }
}
