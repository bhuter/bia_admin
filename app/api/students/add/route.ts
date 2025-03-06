import { NextRequest, NextResponse } from "next/server";
import client from "../../db";

// Register a new user
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { firstName, secondName, email, phone, district, sector, cell, village, status, gender, dob } = await req.json();

    // Input validation
    if (!firstName || !secondName || !email || !phone || !district || !sector || !cell || !village || !status || !gender || !dob) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        // Check for existing users with the same phone or email
        const checkUserSql = `
            SELECT * FROM tailors_students WHERE phone = $1 AND email = $2
        `;
        const existingUserResult = await client.query(checkUserSql, [phone, email]);

        if (existingUserResult.rows.length > 0) {
            return NextResponse.json({ message: "The student is already applied in system." }, { status: 400 });
        }

        // Set default values for new user
        const account_status = 'active';
        const fees_status = "Not paid";
        const createdAt = new Date();

       
        // Insert user into the database
        const insertUserSql = `
            INSERT INTO tailors_students (first_name, second_name, email, phone, district, sector, cell, village, martial_status, gender, dob, created_at, status, fees_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *
        `;
        const insertValues = [firstName, secondName, email, phone, district,  sector, cell, village, status, gender, dob, createdAt, account_status, fees_status];
        const result = await client.query(insertUserSql, insertValues);

        return NextResponse.json({ message: "Student registered successfully!", user: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
