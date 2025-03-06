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
          return NextResponse.json({ message: "Delivery ID is required." }, { status: 400 });
      }

    try {
      let query = `UPDATE delivery SET status = 'Canceled' WHERE id = $1 RETURNING order_number`;
   
        // Fetch Delivery details
        const DeliveryResult = await client.query(query, [id]);

        if (DeliveryResult.rows.length === 0) {
            return NextResponse.json({ message: "Delivery not found." }, { status: 404 });
        }

        return NextResponse.json(DeliveryResult.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error retrieving Delivery:", error);
        return NextResponse.json({ message: "Error retrieving Delivery", error: (error as Error).message }, { status: 500 });
    }
}
