export const dynamic = "force-dynamic";



import { NextResponse } from "next/server";
import client from "../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = `
      SELECT 
      p.id,
      p.name,
      p.stock,
      p.description,
      p.category,
      p.price,
      p.colors,
      p.state,
      p.image,
      p.sizes,
      p.status,
      p.hashed_id,
      (SELECT COUNT(*) FROM orderdetails WHERE product_id = p.id) as orders
      FROM products p
    `;
   
    const params: any[] = [];

    const conditions = [];
    if (filter) {
      if(filter.includes("tock")){
        conditions.push(` NOT p.stock > 0 `);
      }else{
        conditions.push(`p.status = $${params.length + 1}`);
        params.push(filter);
      }
      
    }
    if (search) {
      conditions.push(`(p.name ILIKE $${params.length + 1} OR p.category ILIKE $${params.length + 1} OR CAST(p.price AS TEXT) ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    if (sort) {
      if (sort === "new") {
        query += " ORDER BY p.created_at DESC";
      } else if (sort === "old") {
        query += " ORDER BY p.created_at ASC";
      }else if (sort === "min-max") {
        query += " ORDER BY p.price ASC";
      } else if (sort === "max-min") {
        query += " ORDER BY p.price DESC";
      } else if (sort === "category") {
        query += " ORDER BY p.category ASC";
      }
    } else {
      query += " ORDER BY p.id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
