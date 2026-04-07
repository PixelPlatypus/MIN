import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const expectedPassword = process.env.TESTPREP_DELETE_PASSWORD;

  if (!expectedPassword) {
    console.error("TESTPREP_DELETE_PASSWORD is not set in environment variables.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { password } = await request.json();

    if (password === expectedPassword) {
      (await cookies()).set('testprep_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Authentication API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const isAuthenticated = (await cookies()).get('testprep_authenticated')?.value === 'true';
  return NextResponse.json({ authenticated: isAuthenticated });
}
