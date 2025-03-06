// app/api/products/route.ts
import { NextResponse } from 'next/server';
import client from '../../db'; // Adjust the path to your database client

export async function GET() {
    try {
        const sql = "SELECT * FROM categories";
        const result = await client.query(sql);

        // Return products as JSON
        return NextResponse.json(result.rows);
    } catch (error) {
        // Handle errors
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error retrieving products", error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Unknown error occurred." }, { status: 500 });
    }
}
