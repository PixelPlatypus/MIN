import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const UPLOAD_PASSWORD = process.env.UPLOAD_CERTIFICATE_PASSWORD;

  if (!UPLOAD_PASSWORD) {
    console.error('UPLOAD_CERTIFICATE_PASSWORD is not set in environment variables.');
    return NextResponse.json(
      { message: 'Server configuration error.' },
      { status: 500 }
    );
  }

  if (password === UPLOAD_PASSWORD) {
    return NextResponse.json({ message: 'Authentication successful.' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
  }
}