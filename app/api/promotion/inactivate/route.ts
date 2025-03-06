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
          return NextResponse.json({ message: "Promotion ID is required." }, { status: 400 });
      }

    try {
      let query = `UPDATE promotion SET status = 'inactive' WHERE id = $1 RETURNING *`;
   
        // Fetch Promotion details
        const PromotionResult = await client.query(query, [id]);

        if (PromotionResult.rows.length === 0) {
            return NextResponse.json({ message: "Promotion not found." }, { status: 404 });
        }

        return NextResponse.json(PromotionResult.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error retrieving Promotion:", error);
        return NextResponse.json({ message: "Error retrieving Promotion"+error, error: (error as Error).message }, { status: 500 });
    }
}
