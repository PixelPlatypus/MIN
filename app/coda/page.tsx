import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export default function CodePage() {
  const filePath = path.join(process.cwd(), 'data', 'coda.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  const redirectLink = data.redirect_link;

  redirect(redirectLink);

  return null;
}