import { NextRequest, NextResponse } from 'next/server';
import { getUserPermissions } from '../authorizations';

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
          return NextResponse.json({ message: "Order ID is required." }, { status: 400 });
      }

    try {
      const response =  await getUserPermissions(id);
      return NextResponse.json({
        message: "Success!",
        response
      }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving Order:", error);
        return NextResponse.json({ message: "Error retrieving Order", error: (error as Error).message }, { status: 500 });
    }
}
