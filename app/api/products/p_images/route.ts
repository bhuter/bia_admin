import { NextRequest, NextResponse } from 'next/server';
const cloudinary = require('../../claudinary'); // Adjust to your Cloudinary file
import client from '../../db';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Upload Image to Cloudinary
async function uploadImageToCloudinary(file: File, title: string): Promise<string> {
  try {
    const tempDir = os.tmpdir();
    const documentPath = path.join(tempDir, file.name);
    const buffer = await file.arrayBuffer();

    await fs.writeFile(documentPath, Buffer.from(buffer)); // Async write

    // Convert title to a valid Cloudinary public_id format
    const publicId = title.replace(/\s+/g, "_").toLowerCase();

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(documentPath, {
      use_filename: true,
      folder: 'bia/uploads/images/products/relational_images',
      public_id: publicId,
      resource_type: 'image', // Ensure correct resource type
    });

    await fs.unlink(documentPath); // Remove the temp file asynchronously
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload to Cloudinary");
  }
}

// Handle PUT request for updating a product
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    if (!formData) return NextResponse.json({ error: 'No form data provided' }, { status: 400 });

    const files = formData.getAll('relational_images') as File[];
    const id = formData.get('id') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No relational images provided' }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file, file.name))
    );
    await client.query(`DELETE FROM product_relational_images WHERE product_id = $1`,[id]);
    // Insert image URLs into the database
    for (const imageUrl of uploadedImages) {
      await client.query(
        `INSERT INTO product_relational_images (product_id, image_url) VALUES ($1, $2)`,
        [id, imageUrl]
      );
    }

    return NextResponse.json({ message: 'Images uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Product update failed', error }, { status: 500 });
  }
}
