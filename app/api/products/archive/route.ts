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
          return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
      }

    try {
      let query = `UPDATE products SET status = 'Archived' WHERE id = $1 RETURNING name`;
   
        // Fetch Product details
        const ProductResult = await client.query(query, [id]);

        if (ProductResult.rows.length === 0) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        return NextResponse.json(ProductResult.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error retrieving Product:", error);
        return NextResponse.json({ message: "Error retrieving Product", error: (error as Error).message }, { status: 500 });
    }
}
