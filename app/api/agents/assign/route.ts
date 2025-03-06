import { NextRequest, NextResponse } from "next/server";
import client from "../../db";

// Helper function to calculate the delivery date
function calculateDeliveryDate(daysToAdd: number): Date {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);
  return currentDate;
}

// Assign delivery
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { orderId, agentId } = await req.json();

    // Input validation
    if (!orderId || !agentId) {
      return NextResponse.json(
        { message: "All fields are required: orderId, agentId." },
        { status: 400 }
      );
    }

    // Extract orderNumber and order_id from orderId
    const [orderNumber, order_id] = orderId.split(",").map((part: string) => part.trim());
    const status = "Pending";

    // Check if the delivery is already assigned
    const checkAssignmentSql = `
      SELECT * FROM delivery WHERE order_id = $1
    `;
    const checkAssignmentResult = await client.query(checkAssignmentSql, [order_id]);

    if (checkAssignmentResult.rows.length > 0) {
      // If already assigned, update the agent and return response
      const updateDeliverySql = `
        UPDATE delivery SET agent_id = $1 WHERE order_id = $2 RETURNING *
      `;
      const updatedDelivery = await client.query(updateDeliverySql, [agentId, order_id]);

      // Update order status to "Approved"
      const updateOrderStatusSql = `
        UPDATE orders SET status = 'Approved' WHERE order_id = $1
      `;
      await client.query(updateOrderStatusSql, [order_id]);

      return NextResponse.json(
        { message: "Delivery re-assigned successfully!", delivery: updatedDelivery.rows[0] },
        { status: 200 }
      );
    }else{

    // If not assigned, proceed to assign a new delivery
    const deliveryDate = calculateDeliveryDate(3); // Add 3 days to today's date
    const createdAt = new Date();

    const insertDeliverySql = `
      INSERT INTO delivery (order_number, order_id, agent_id, status, delivery_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const insertValues = [orderNumber, order_id, agentId, status, deliveryDate, createdAt];
    const newDelivery = await client.query(insertDeliverySql, insertValues);

    // Update order status to "Approved"
    const updateOrderStatusSql = `
      UPDATE orders SET status = 'Approved' WHERE order_id = $1
    `;
    await client.query(updateOrderStatusSql, [order_id]);

    return NextResponse.json(
      { message: "Delivery assigned successfully!", delivery: newDelivery.rows[0] },
      { status: 201 }
    );
  }
  } catch (error) {
    console.error("Error during delivery assignment:", error);

    return NextResponse.json(
      { message: "Error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}
