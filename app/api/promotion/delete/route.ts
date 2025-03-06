// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import client from "../../db"; // Adjust the path to your database client

export async function DELETE(req: NextRequest): Promise<NextResponse> {
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
        const result = await client.query("DELETE FROM promotion WHERE id = $1", [id]);

        if (result) {
            return NextResponse.json({ message: "Promotion deleted" }, { status: 200 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured, try again", error }, { status: 500 });
    }
}
