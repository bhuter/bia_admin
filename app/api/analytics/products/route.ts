export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    // Query to fetch institution statistics
    const query = `
      SELECT 
        COUNT(*) AS total_products,
        SUM(CASE WHEN s.status = 'Archived' THEN 1 ELSE 0 END) AS total_archived,
        SUM(CASE WHEN s.status ='Active' or s.status = 'Approved' THEN 1 ELSE 0 END) AS total_active,
        SUM(CASE WHEN s.status = 'Draft' OR s.status = 'Pending' THEN 1 ELSE 0 END) AS total_pending
      FROM products s
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    // Prepare response
    const response = {
      total_products: parseInt(data.total_products || "0"),
      total_active: parseInt(data.total_active || "0"),
      total_pending: parseInt(data.total_pending || "0"),
      total_archived: parseInt(data.total_archived || "0"),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving institution analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
 