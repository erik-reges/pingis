import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("API route hit");

  try {
    const body = await request.json();
    console.log("Received body:", body);

    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    // Set cookie
    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
