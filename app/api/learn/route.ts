import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'learn.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error reading learn.json:', error);
    return new Response(JSON.stringify({ error: 'Failed to load learn data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}