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
         u.*,
         (SELECT COUNT(*) FROM delivery d WHERE d.agent_id = u.id AND d.status = 'Active') AS sales
        FROM users u
        WHERE u.account_type='agent' 
        `;

        const params: any[] = [];

        const conditions = [];
        if (filter) {
            conditions.push(`u.status = $${params.length + 1}`);
            params.push(filter);
           
        }
        if (search) {
          conditions.push(`(
            u.first_name ILIKE $${params.length + 1} 
            OR u.status ILIKE $${params.length + 1} 
            OR u.email ILIKE $${params.length + 1} 
            OR u.phone ILIKE $${params.length + 1} 
            OR u.nationality ILIKE $${params.length + 1} 
            OR u.last_name ILIKE $${params.length + 1}
            OR u.billingaddress ILIKE $${params.length + 1}
            )`);
          params.push(`%${search}%`);
        }
    
        if (conditions.length) {
          query += ` AND ${conditions.join(" AND ")}`;
        }
    
        // Sorting
        if (sort) {
          if (sort === "new") {
            query += " ORDER BY u.created_at DESC";
          } else if (sort === "old") {
            query += " ORDER BY u.created_at ASC";
          } else if (sort === "status") {
            query += " ORDER BY u.status ASC";
          }
        } else {
          query += " ORDER BY u.id DESC";
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
