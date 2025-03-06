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
        // Fetch product details
        const productResult = await client.query(`SELECT * FROM products WHERE id = $1`, [id]);
        // Fetch relational images
        const imagesResult = await client.query(
            `SELECT image_url AS relational_images FROM product_relational_images WHERE product_id = $1`, 
            [id]
        );

        if (productResult.rows.length === 0) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        // Combine product data with relational images
        const product = productResult.rows[0];
        product.relational_images = imagesResult.rows.map((row: { relational_images: any; }) => row.relational_images);

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error retrieving product:", error);
        return NextResponse.json({ message: "Error retrieving product", error: (error as Error).message }, { status: 500 });
    }
}
