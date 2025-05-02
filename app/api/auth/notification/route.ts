import client from '../../db'; // Adjust the path to your database client
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const result = await client.query(`
      SELECT 
        n.id,
        n.content_text,
        n.user_id,
        n.event,
        n.mailed,
        n.sms,
        n.system,
        n.view,
        n.action_required,
        n.created_at,
        n.read_at,
        n.admin,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM notification n
      LEFT JOIN users u ON u.id::text = n.user_id
      ORDER BY n.id DESC
    `);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error retrieving notifications", error }, { status: 500 });
  }
}
