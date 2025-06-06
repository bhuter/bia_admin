import { NextRequest, NextResponse } from 'next/server';
import client from "../../db"; // Adjust the path to your database client
import { sendActivityEmail } from '../../utils/config';

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
          return NextResponse.json({ message: "Agent ID is required." }, { status: 400 });
      }

    try {
      let query = `UPDATE users SET status = 'Locked' WHERE id = $1 AND account_type = 'customer' RETURNING *`;
   
        // Fetch Agent details
        const AgentResult = await client.query(query, [id]);

        if (AgentResult.rows.length === 0) {
            return NextResponse.json({ message: "Agent not found." }, { status: 404 });
        }

        const message = `Your BIA account is now locked. To unlock please contact admin`;
        const subject = "Your Account is Locked";

        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'false', 'false', NOW())`;
        await client.query(notification, [message, id, "Updates", "true", "Unread", `/dash/profile`, "Unread"])

        await sendActivityEmail(AgentResult.rows[0].email, AgentResult.rows[0].first_name, message, subject);

        return NextResponse.json(AgentResult.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error retrieving Agent:", error);
        return NextResponse.json({ message: "Error retrieving Agent", error: (error as Error).message }, { status: 500 });
    }
}
