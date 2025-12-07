import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { put, list, del } from '@vercel/blob';

const filePath = path.join(process.cwd(), 'data', 'trinity-results.json');

async function readFromFs() {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    if (Array.isArray(data)) return data;
    return [];
  } catch (e: any) {
    return [];
  }
}

async function writeToFs(entry: any) {
  try {
    const existing = await readFromFs();
    existing.push(entry);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

function slugifyName(name: string) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET() {
  try {
    const blobs = await list({ prefix: 'testprep/results/' });
    const results: any[] = [];
    for (const b of blobs.blobs) {
      try {
        const r = await fetch(b.url);
        if (r.ok) {
          const json = await r.json();
          results.push(json);
        }
      } catch {}
    }
    if (results.length === 0) {
      const fsData = await readFromFs();
      return NextResponse.json(fsData);
    }
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return NextResponse.json(results);
  } catch (error) {
    const fsData = await readFromFs();
    return NextResponse.json(fsData);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { studentName, score, percentage, timestamp, timeSpent, studentEmail, studentGrade, studentSection } = payload || {};
    if (!studentName || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const allowedGrades = ['11','12','a levels','A LEVELS','A Levels','A levels'];
    const normalizedGrade = typeof studentGrade === 'string' ? studentGrade.trim() : '';
    const safeGrade = allowedGrades.includes(normalizedGrade) ? (normalizedGrade.toLowerCase().startsWith('a') ? 'A levels' : normalizedGrade) : null;

    const entry = {
      studentName,
      studentEmail: typeof studentEmail === 'string' ? studentEmail : null,
      studentGrade: safeGrade,
      studentSection: typeof studentSection === 'string' ? studentSection : null,
      score,
      percentage: typeof percentage === 'number' ? percentage : null,
      timeSpent: typeof timeSpent === 'number' ? timeSpent : null,
      timestamp: timestamp || new Date().toISOString(),
    };
    try {
      const nameSlug = slugifyName(studentName);
      const ts = new Date(entry.timestamp).toISOString();
      const fileName = `${ts}-${nameSlug}.json`;
      await put(`testprep/results/${nameSlug}/${fileName}`, JSON.stringify(entry), { access: 'public', addRandomSuffix: false });
      return NextResponse.json({ ok: true });
    } catch (e) {
      const ok = await writeToFs(entry);
      if (ok) return NextResponse.json({ ok: true, fallback: 'fs' });
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const expected = process.env.TESTPREP_DELETE_PASSWORD;
    let provided = '';
    try {
      const body = await request.json();
      provided = String(body?.password || '');
    } catch {}
    if (!provided || provided !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blobs = await list({ prefix: 'testprep/results/' });
    for (const b of blobs.blobs) {
      try {
        await del(b.url);
      } catch {}
    }
    try {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
    } catch {}
    return NextResponse.json({ ok: true, deleted: blobs.blobs.length });
  } catch (error) {
    try {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
    } catch {}
    return NextResponse.json({ ok: true, deleted: 0, fallback: 'fs' });
  }
}
