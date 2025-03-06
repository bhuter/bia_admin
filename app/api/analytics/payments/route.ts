export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    // Query to fetch payment statistics
    const query = `
      SELECT 
        SUM(CAST(amount AS FLOAT)) FILTER (WHERE status = 'Paid') AS total_paid,
        SUM(CAST(amount AS FLOAT)) FILTER (WHERE status = 'Pending') AS total_pending,
        SUM(CAST(amount AS FLOAT)) FILTER (WHERE status = 'Failed') AS total_failed,
        SUM(CAST(amount AS FLOAT)) FILTER (WHERE status = 'Canceled') AS total_canceled,
        SUM(CAST(tax_amount AS FLOAT)) FILTER (WHERE status = 'Paid') AS total_tax_paid
      FROM payments
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    // Prepare response
    const response = {
      total_paid: parseFloat(data.total_paid || "0"),
      total_pending: parseFloat(data.total_pending || "0"),
      total_failed: parseFloat(data.total_failed || "0"),
      total_canceled: parseFloat(data.total_canceled || "0"),
      total_tax_paid: parseFloat(data.total_tax_paid || "0"),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving payment statistics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
