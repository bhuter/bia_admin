export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    // Query to fetch institution statistics
    const query = `
      SELECT 
        COUNT(*) AS total_orders,
        SUM(CASE WHEN s.status = 'Approved' THEN 1 ELSE 0 END) AS total_approved,
        SUM(CASE WHEN s.status ='Active' THEN 1 ELSE 0 END) AS total_active,
        SUM(CASE WHEN s.status = 'Pending' THEN 1 ELSE 0 END) AS total_pending,
        SUM(CASE WHEN s.status = 'Canceled' THEN 1 ELSE 0 END) AS total_canceled,
        SUM(CASE WHEN s.status = 'Delivered' THEN 1 ELSE 0 END) AS total_delivered
      FROM orders s
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    // Prepare response
    const response = {
      total_orders: parseInt(data.total_orders || "0"),
      total_active: parseInt(data.total_active || "0"),
      total_pending: parseInt(data.total_pending || "0"),
      total_approved: parseInt(data.total_approved || "0"),
      total_delivered: parseInt(data.total_delivered || "0"),
      total_canceled: parseInt(data.total_canceled || "0"),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving orders analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
 