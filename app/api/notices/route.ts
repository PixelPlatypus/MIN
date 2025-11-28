import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'notices.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const now = new Date();
    const filtered = Array.isArray(data)
      ? data.filter((item: any) => {
          const dateStr = item?.turnOffNoticeDate ?? item?.['turn-off notice date'];
          if (!dateStr || typeof dateStr !== 'string') return true;
          const turnOff = new Date(dateStr);
          if (isNaN(turnOff.getTime())) return true;
          turnOff.setHours(23, 59, 59, 999);
          return now <= turnOff;
        })
      : data;

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error reading notices.json:', error);
    return NextResponse.json({ error: 'Failed to load notices' }, { status: 500 });
  }
}
