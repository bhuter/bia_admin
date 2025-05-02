export const config = {
  api: {
    bodyParser: false,
  },
};

import { NextRequest, NextResponse } from "next/server";
import client from "../../db";
import uploadDocumentToSupabase from "../../supabase";

// Define types for the product request
type ProductRequest = {
  name: string;
  price: string;
  category_id: string;
  description: string;
  stock: string;
  image: File; // Keep as is for handling image file
};

// Helper function to hash the product ID
async function hashId(id: number): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(id.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Handle POST request for adding a product
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const productData: ProductRequest = {
      name: formData.get('name')?.toString() || '',
      price: formData.get('price')?.toString() || '',
      category_id: formData.get('category_id')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      stock: formData.get('stock')?.toString() || '',
      image: formData.get('image') as File, // Get the image file directly
    };

    console.log("Received data: ", productData); // Log the product data for debugging

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category_id ||
        !productData.description || !productData.stock || !productData.image) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let image;
    try {
      image = await uploadDocumentToSupabase(productData.image, productData.name);
    } catch (uploadError) {
      return NextResponse.json({ error: "Image upload failed", details: uploadError }, { status: 500 });
    }

    let result;
    try {
      // Insert product into the database
      result = await client.query(
        `INSERT INTO products (name, price, category, description, stock, image, status, state, created_at, archived_at)
        VALUES ($1, $2, $3, $4, $5, $6, 'Pending', 'new', NOW(), NULL) RETURNING *`,
        [productData.name, productData.price, productData.category_id,
        productData.description, productData.stock, image]
      );
      
      console.log("Database Insert Result:", result.rows);

      if (!result.rows.length) {
        throw new Error("Database insert failed");
      }
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return NextResponse.json({ error: "Database error", details: dbError }, { status: 500 });
    }

    const productId = result.rows[0].id;
    const hashedProductId = await hashId(productId);

    try {
      // Update the product with the hashed ID (for additional usage in the response)
      await client.query(
        `UPDATE products SET hashed_id = $1 WHERE id = $2`,
        [hashedProductId, productId]
      );

      // Update category avatar and product count
      await client.query(
        `UPDATE categories SET avatar = $1, products = products + 1 WHERE cat_name = $2`,
        [image, productData.category_id]
      );
    } catch (updateError) {
      console.error("Database Update Error:", updateError);
      return NextResponse.json({ error: "Database update failed", details: updateError }, { status: 500 });
    }

    return NextResponse.json({ message: "Product added successfully", product: result.rows[0] }, { status: 201 });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Unexpected server error", details: error }, { status: 500 });
  }
}
