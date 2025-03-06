export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    // Query to fetch payment statistics
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM orders o WHERE o.status='Delivered') AS sales,
        (SELECT COUNT(*) FROM users WHERE account_type='customer') AS customers,
        SUM(CAST(p.amount AS FLOAT)) FILTER (WHERE p.status = 'Paid') AS total_paid,
        SUM(CAST(p.tax_amount AS FLOAT)) FILTER (WHERE p.status = 'Paid') AS total_tax_paid
      FROM payments p
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    const revenue = Number(data.total_paid - data.total_tax_paid)  | 0;
    // Prepare response
    const response = {
      sales: parseFloat(data.sales || "0"),
      customers: parseFloat(data.customers || "0"),
      revenue: revenue,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving payment statistics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
