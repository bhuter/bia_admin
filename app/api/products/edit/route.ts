import { NextRequest, NextResponse } from 'next/server';
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../claudinary'); // Adjust to your Cloudinary file
import client from "../../db";;
// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'bia/uploads/images/products',
    },
});
// Helper function to hash the product ID
async function hashId(id: number): Promise<string> {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(id.toString());
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

// Handle PUT request for updating a product
export async function PUT(req: NextRequest ) {
    try {
        // Parse the form data from the request body
        const formData = await req.formData();
  
        if (!formData) {
            return NextResponse.json({ error: "No form data provided" }, { status: 400 });
        }
        const id = formData.get('id') as string;
        const sizes = formData.get('sizes') as string;
        const colors = formData.get('colors') as string;
        const state = formData.get('state') as string;
        const stock = formData.get('stock') as string;
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const delivery_days = formData.get('delivery_days') as string;
     
  
        // Check if the main image is provided
        const mainImageFile = formData.get('image'); // Assumes 'image' is the name for main image input

        // Update the product details
        const queryText = `
            UPDATE products
            SET 
                sizes = $1, 
                colors = $2, 
                state = $3, 
                stock = $4,
                name = $5,
                price = $6,
                category = $7,
                description = $8,    
                delivery_days = $9,
                hashed_id = $10,
                created_at = NOW(),
                status = 'Active' 
            WHERE id = $11
            RETURNING *;
        `;

        const hashed_id = await hashId(Number(id));

        const values = [sizes, colors, state, stock, name, price, category, description, delivery_days, hashed_id, id];
        const result = await client.query(queryText, values);

       
        return NextResponse.json({ message: "Product details updated successfully", product: result.rows[0] }, { status: 200 });
  
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: "Product update failed", error }, { status: 500 });
    }
}
