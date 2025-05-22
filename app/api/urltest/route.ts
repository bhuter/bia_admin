import { NextRequest, NextResponse } from 'next/server';
import client from "../db"; // Adjust the path to your database client

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
      let query = `UPDATE orders SET created_at = '2025-01-03TZ12:39:03'`;
   
        // Fetch Order details
        const OrderResult = await client.query(query);

        return NextResponse.json("Success", { status: 200 });
    } catch (error) {
        console.error("Error retrieving Order:", error);
        return NextResponse.json({ message: "Error retrieving Order", error: (error as Error).message }, { status: 500 });
    }
}