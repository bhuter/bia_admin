import { NextRequest, NextResponse } from "next/server";
import client from "../../db";;

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { promotionType, productId, expiryDate, promotion } = await req.json();

    // Input validation
    if (!promotionType || !productId || !expiryDate || !promotion) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        // Check for existing promotions of the same type and product
        const checkPromotionSql = `
            SELECT * FROM promotion WHERE promotion_type = $1 AND product_id = $2 AND status = 'active'
        `;
        const existingPromotionResult = await client.query(checkPromotionSql, [promotionType, productId]);

        // If an existing active promotion is found, set it to inactive
        if (existingPromotionResult.rows.length > 0) {
            const deactivatePromotionSql = `
                UPDATE promotion 
                SET status = 'inactive', updated_at = NOW()
                WHERE promotion_type = $1 AND product_id = $2 AND status = 'active'
            `;
            await client.query(deactivatePromotionSql, [promotionType, productId]);
        }

        // Insert the new promotion into the database
        const insertPromotionSql = `
            INSERT INTO promotion (promotion_type, product_id, expiry_date, promotion, status, created_date)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
        `;
        const insertValues = [promotionType, productId, expiryDate, promotion, 'active'];
        const result = await client.query(insertPromotionSql, insertValues);

        return NextResponse.json({ 
            message: "Promotion added successfully!", 
            promotion: result.rows[0] 
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding promotion:", error);
        return NextResponse.json({ 
            message: "Error: " + (error instanceof Error ? error.message : "Unknown error") 
        }, { status: 500 });
    }
}
