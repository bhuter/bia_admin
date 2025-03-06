import { NextRequest, NextResponse } from "next/server";
import client from "../../../db"; // Adjust path as necessary

export async function GET(req: NextRequest) {
  try {
    const query = `
      WITH week_days AS (
        SELECT unnest(ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) AS day
      ),
      daily_orders AS (
        SELECT 
          TO_CHAR(CAST(created_at AS TIMESTAMP), 'Dy') AS day,
          COUNT(*) AS current_week_orders
        FROM orders
        WHERE CAST(created_at AS TIMESTAMP) >= date_trunc('week', CURRENT_DATE)
        GROUP BY day
      ),
      previous_week_orders AS (
        SELECT 
          TO_CHAR(CAST(created_at AS TIMESTAMP), 'Dy') AS day,
          COUNT(*) AS previous_week_orders
        FROM orders
        WHERE CAST(created_at AS TIMESTAMP) >= date_trunc('week', CURRENT_DATE) - INTERVAL '7 days'
          AND CAST(created_at AS TIMESTAMP) < date_trunc('week', CURRENT_DATE)
        GROUP BY day
      )
      SELECT 
        w.day,
        COALESCE(p.previous_week_orders, 0) AS previous,
        COALESCE(d.current_week_orders, 0) AS current
      FROM week_days w
      LEFT JOIN daily_orders d ON w.day = d.day
      LEFT JOIN previous_week_orders p ON w.day = p.day
      ORDER BY ARRAY_POSITION(ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], w.day);
    `;

    const result = await client.query(query);

    const ordersData = result.rows.map((row: any) => ({
      day: row.day,
      previous: row.previous,
      current: row.current,
    }));

    return NextResponse.json(ordersData);
  } catch (err) {
    console.error("Error fetching orders comparison:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
