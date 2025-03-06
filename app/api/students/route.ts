import { NextResponse } from 'next/server';
import client from "../db";; // Adjust the path according to your file structure

export async function GET() {
    try {
        // Execute query to fetch all products ordered by descending ID
        const result = await client.query("SELECT * FROM tailors_students ORDER BY id DESC");

        // Send retrieved products back as a JSON response
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {        
        console.error("Error retrieving students:", error);

        // Send a 500 status code if a server error occurs
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
