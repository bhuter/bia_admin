import { NextRequest, NextResponse } from 'next/server';
import client from "../../db"; // Adjust the path to your database client

export async function PUT(req: NextRequest): Promise<NextResponse> {
    
    let requestBody;
      
      // Safe JSON parsing
      try {
          requestBody = await req.json();
      } catch (error) {
          return NextResponse.json({ message: "Invalid JSON format in request." }, { status: 400 });
      }
      const {id} = requestBody;
      
      if (!id) {
          return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
      }

    try {
        // Fetch product details
        const productResult = await client.query(`
 SELECT 
    o.order_number,
    o.total_amount,
    p.tax_amount,
    o.billing_address,
    o.status AS order_status,
    o.payment_method,
    o.delivery_allowed,
    o.order_date,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    p.account,
    p.full_name AS payer_name,
    p.status AS payment_status,
    d.status AS delivery_status,
    a.first_name AS agent_first_name,
    a.last_name AS agent_last_name,
    a.status AS agent_status
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN payments p ON p.user_id = o.user_id
JOIN delivery d ON d.order_id = o.order_id
LEFT JOIN users a ON a.id = d.agent_id AND a.account_type = 'agent'
WHERE o.order_id = $1;

          `, [id]);
       

        if (productResult.rows.length === 0) {
            return NextResponse.json({ message: "Details not found." }, { status: 404 });
        }

        // Combine product data with relational images
        const product = productResult.rows[0];

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error retrieving product:", error);
        return NextResponse.json({ message: "Error retrieving product", error: (error as Error).message }, { status: 500 });
    }
}
