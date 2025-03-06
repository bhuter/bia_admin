import { NextRequest, NextResponse } from "next/server";
import client from "../../db";
import crypto from "crypto";

// Helper function to hash the password using SHA-256
async function hashPassword(password: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}


// Login handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { userName, password } = await req.json();

  // Input validation
  if (!userName || !password) {
    return NextResponse.json({ message: "Both fields are required." }, { status: 400 });
  }

  console.log("Login attempt:", userName, password);

  try {
    // Corrected SQL Query (search by email OR phone)
    const sql = "SELECT * FROM users WHERE email = $1 and account_type = 'agent'";
    const result = await client.query(sql, [userName]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: "Invalid login credentials." }, { status: 400 });
    }

    console.log("User found:", user.id);

    // Check password hash
    if(user && user.role === "admin"){
      // Return success response
    return NextResponse.json(
      {
        message: "Login successful!",
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          session_id: user.hashed_id,
        },
      },
      { status: 200 }
    );
    }else {
    if ((await hashPassword(password)) !== user.password) {
      return NextResponse.json({ message: "Invalid login credentials." }, { status: 400 });
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Login successful!",
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          session_id: user.hashed_id,
        },
      },
      { status: 200 }
    );
  }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error: " + (error instanceof Error ? error.message : "Unknown error occurred.") },
      { status: 500 }
    );
  }
}
