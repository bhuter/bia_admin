import { NextResponse } from 'next/server';
import client from "../db";; // Adjust the path according to your file structure

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
    
        // Extract query parameters
        const filter = searchParams.get("filter");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort");

        // Execute query to fetch all products ordered by descending ID
        let query = `
            SELECT  
                o.order_id, 
                o.order_number, 
                o.total_amount, 
                o.status, 
                o.created_at, 
                u.id AS user_id, 
                u.first_name, 
                u.last_name, 
                u.photo, 
                p.payment_id, 
                p.status AS payment_status,
                (
                    SELECT COUNT(*)
                    FROM orderdetails
                    WHERE orderdetails.order_id = o.order_id
                ) AS count
            FROM orders o  
            LEFT JOIN users u ON u.id = o.user_id 
            LEFT JOIN payments p ON CAST(p.order_id AS TEXT) = o.order_number 
            
        `;
        
        const params: any[] = [];

        const conditions = [];
        if (filter) {
           if(filter === "Paid" || filter === "Pending"){
             conditions.push(`p.status = $${params.length + 1}`);
             params.push(filter);
           } else {
            conditions.push(`o.status = $${params.length + 1}`);
            params.push(filter);
           }
        }
        if (search) {
          conditions.push(`(o.order_number ILIKE $${params.length + 1} OR o.status ILIKE $${params.length + 1} OR p.status ILIKE $${params.length + 1} OR CAST(o.total_amount AS TEXT) ILIKE $${params.length + 1} OR u.first_name ILIKE $${params.length + 1} OR u.last_name ILIKE $${params.length + 1})`);
          params.push(`%${search}%`);
        }
    
        if (conditions.length) {
          query += ` WHERE ${conditions.join(" AND ")}`;
        }
    
        // Sorting
        if (sort) {
          if (sort === "new") {
            query += " ORDER BY o.created_at DESC";
          } else if (sort === "old") {
            query += " ORDER BY o.created_at ASC";
          } else if (sort === "status") {
            query += " ORDER BY o.status ASC";
          }
        } else {
          query += " ORDER BY o.order_id DESC";
        }
    
        const result = await client.query(query, params);
    

        // Send retrieved orders back as a JSON response
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {        
        console.error("Error retrieving orders:", error);

        // Send a 500 status code if a server error occurs
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
