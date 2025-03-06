export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const query = `
      WITH current AS (
        SELECT 
          (SELECT COUNT(*) FROM orders) AS total_orders,
          (SELECT COUNT(*) FROM orders WHERE status = 'Delivered') AS total_delivered,
          (SELECT SUM(total_amount) FROM orders WHERE status = 'Delivered') AS total_sales,
          (SELECT SUM(CAST(amount AS FLOAT)) - SUM(CAST(tax_amount AS FLOAT)) FROM payments WHERE status = 'Paid') AS total_revenue,
          (SELECT COUNT(*) FROM users WHERE account_type = 'customer') AS total_customers
      ),
      previous AS (
        SELECT 
          (SELECT COUNT(*) FROM orders WHERE EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $1 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $2) AS prev_orders,
          (SELECT COUNT(*) FROM orders WHERE status = 'Delivered' AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $1 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $2) AS prev_delivered,
          (SELECT SUM(total_amount) FROM orders WHERE status = 'Delivered' AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $1 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $2) AS prev_sales,
          (SELECT SUM(CAST(amount AS FLOAT)) - COALESCE(SUM(CAST(tax_amount AS FLOAT)), 0) FROM payments WHERE status = 'Paid' AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $1 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $2) AS prev_revenue,
          (SELECT COUNT(*) FROM users WHERE account_type = 'customer' AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $1 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $2) AS prev_customers
      )
      SELECT 
        current.total_orders, 
        current.total_delivered, 
        current.total_sales, 
        current.total_revenue, 
        current.total_customers,

        -- Count Range Changes
        current.total_orders - previous.prev_orders AS order_change,
        current.total_delivered - previous.prev_delivered AS delivered_change,
        current.total_sales - previous.prev_sales AS sales_change,
        current.total_revenue - previous.prev_revenue AS revenue_change,
        current.total_customers - previous.prev_customers AS customer_change,

        -- Percentage Growth
        ROUND(((current.total_orders - previous.prev_orders)::numeric / NULLIF(previous.prev_orders, 0)::numeric) * 100, 2) AS order_growth,
        ROUND(((current.total_delivered - previous.prev_delivered)::numeric / NULLIF(previous.prev_delivered, 0)::numeric) * 100, 2) AS delivered_growth,
        ROUND(((current.total_sales - previous.prev_sales)::numeric / NULLIF(previous.prev_sales, 0)::numeric) * 100, 2) AS sales_growth,
        ROUND(((current.total_revenue - previous.prev_revenue)::numeric / NULLIF(previous.prev_revenue, 0)::numeric) * 100, 2) AS revenue_growth,
        ROUND(((current.total_customers - previous.prev_customers)::numeric / NULLIF(previous.prev_customers, 0)::numeric) * 100, 2) AS customer_growth

        FROM current, previous;
    `;

    const result = await client.query(query, [lastMonth, lastMonthYear]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
