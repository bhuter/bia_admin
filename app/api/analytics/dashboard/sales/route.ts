import { NextRequest, NextResponse } from "next/server";
import client from "../../../db"; // Adjust path as necessary

export async function GET(req: NextRequest) {
  try {
    const query = `
      WITH week_days AS (
        SELECT unnest(ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) AS day
      ),
      daily_payments AS (
        SELECT 
          TO_CHAR((created_at::TIMESTAMP WITH TIME ZONE AT TIME ZONE 'Africa/Johannesburg'), 'Dy') AS day,
          SUM((amount::NUMERIC) - (tax_amount::NUMERIC)) AS current_week_payments
        FROM payments
        WHERE (created_at::TIMESTAMP WITH TIME ZONE AT TIME ZONE 'Africa/Johannesburg') >= date_trunc('week', CURRENT_DATE AT TIME ZONE 'Africa/Johannesburg')
        GROUP BY day
      ),
      previous_week_payments AS (
        SELECT 
          TO_CHAR((created_at::TIMESTAMP WITH TIME ZONE AT TIME ZONE 'Africa/Johannesburg'), 'Dy') AS day,
          SUM((amount::NUMERIC) - (tax_amount::NUMERIC)) AS previous_week_payments
        FROM payments
        WHERE (created_at::TIMESTAMP WITH TIME ZONE AT TIME ZONE 'Africa/Johannesburg') >= date_trunc('week', CURRENT_DATE AT TIME ZONE 'Africa/Johannesburg') - INTERVAL '7 days'
          AND (created_at::TIMESTAMP WITH TIME ZONE AT TIME ZONE 'Africa/Johannesburg') < date_trunc('week', CURRENT_DATE AT TIME ZONE 'Africa/Johannesburg')
        GROUP BY day
      )
      SELECT 
        w.day,
        COALESCE(p.previous_week_payments, 0) AS previous,
        COALESCE(d.current_week_payments, 0) AS current
      FROM week_days w
      LEFT JOIN daily_payments d ON w.day = d.day
      LEFT JOIN previous_week_payments p ON w.day = p.day
      ORDER BY ARRAY_POSITION(ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], w.day);
    `;

    const result = await client.query(query);

    const paymentsData = result.rows.map((row: any) => ({
      day: row.day,
      previous: row.previous,
      current: row.current,
    }));

    return NextResponse.json(paymentsData);
  } catch (err) {
    console.error("Error fetching payments comparison:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } 
}
