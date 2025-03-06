export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    // Query to fetch institution statistics
    const query = `
      SELECT 
        COUNT(*) AS total_students,
        SUM(CASE WHEN status ='active' THEN 1 ELSE 0 END) AS total_active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS total_pending,
        SUM(CASE WHEN status = 'graduated' THEN 1 ELSE 0 END) AS total_graduated,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS total_inactive
      FROM tailors_students 
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    // Prepare response
    const response = {
      total_students: parseInt(data.total_students || "0"),
      total_active: parseInt(data.total_active || "0"),
      total_pending: parseInt(data.total_pending || "0"),
      total_inactive: parseInt(data.total_inactive || "0"),
      total_graduated: parseInt(data.total_graduated || "0"),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving orders analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
 