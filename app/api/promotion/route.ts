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
        p.*, 
        CASE 
          WHEN p.product_id ~ '^[0-9]+$' THEN pr.name
          ELSE NULL
        END AS product
      FROM promotion p
      LEFT JOIN products pr ON p.product_id::TEXT = pr.id::TEXT
    `;

  
    const params: any[] = [];

    const conditions = [];
    if (filter) {
        conditions.push(`p.status = $${params.length + 1}`);
        params.push(filter);
       
    }
    if (search) {
      conditions.push(`(
        pr.name ILIKE $${params.length + 1} 
        OR p.status ILIKE $${params.length + 1} 
        OR p.promotion ILIKE $${params.length + 1} 
        OR p.promotion_type ILIKE $${params.length + 1} 
        )`);
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
      } else if (sort === "status") {
        query += " ORDER BY p.status ASC";
      }
    } else {
      query += " ORDER BY p.id DESC";
    }

    const result = await client.query(query, params);


    // Send retrieved orders back as a JSON response
    return NextResponse.json(result.rows, { status: 200 });
} catch (error) {        
    console.error("Error retrieving orders:", error);

    // Send a 500 status code if a server error occurs
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}
}
