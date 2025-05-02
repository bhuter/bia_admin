export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import client from "../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    // Extract query parameters using Next.js `searchParams`
    const { searchParams } = new URL(req.url);

    const filter = searchParams.get("filter");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = "SELECT * FROM payments";
    const params: any[] = [];
    const conditions: string[] = [];

    // Add filtering conditions
    if (filter) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filter);
    }
    if (search) {
      conditions.push(`(full_name ILIKE $${params.length + 1} OR payment_method ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR account ILIKE $${params.length + 1} OR transaction_id ILIKE $${params.length + 1} OR CAST(order_id AS TEXT) ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Handle sorting
    switch (sort) {
      case "new":
        query += " ORDER BY created_at DESC";
        break;
      case "old":
        query += " ORDER BY created_at ASC";
        break;
      case "currency":
        query += " ORDER BY currency ASC";
        break;
      case "max-min":
        query += " ORDER BY amount DESC";
        break;
      case "tax":
        query += " ORDER BY tax_amount DESC";
        break;
      default:
        query += " ORDER BY payment_id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving payments:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
