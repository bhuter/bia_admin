import { NextRequest, NextResponse } from 'next/server';

import client from '../../db';
import uploadDocumentToSupabase, { deleteDocumentFromSupabase } from '../../supabase';

function splitByKRB(word: string) {
  const parts = word.split("/bia/");
  
  if (parts.length === 1) {
      return { left: word, right: "" }; // If 'krb' is not found
  }

  return { left: parts[0], right: parts.slice(1).join("krb") }; // Preserve everything after 'krb'
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
      files.map((file) => uploadDocumentToSupabase(file, file.name+""+id))
    );
    const current_images = await client.query(`SELECT * FROM product_relational_images WHERE product_id = $1`,[id]);
    const results = current_images.rows;

    for (const url of results) {
      const n = splitByKRB(url.image_url);
      await deleteDocumentFromSupabase(n.right);
    }

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
