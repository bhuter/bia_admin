// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import client from '../../../db'; // Adjust the path to your database client

export async function GET() {
    try {
        const result = await client.query("UPDATE notification SET admin='Read' WHERE user_id != ''");

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error retrieving notifications", error }, { status: 500 });
    }
}
