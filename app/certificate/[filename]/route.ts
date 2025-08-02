import { redirect } from 'next/navigation';


export async function GET(request: Request, { params }: { params: { filename: string } }) {
  const { filename } = params;

  if (!filename) {
    return new Response('Missing filename parameter', { status: 400 });
  }

  // Construct the Vercel Blob URL. The store ID is typically part of the BLOB_READ_WRITE_TOKEN.
  // This assumes the filename directly corresponds to the blob path.
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.split('_')[2];
  if (!storeId) {
    return new Response('Vercel Blob store ID not configured.', { status: 500 });
  }
  const blobUrl = `https://${storeId}.public.blob.vercel-storage.com/${filename}`;

  // Redirect to the constructed blob URL.
  // In a production environment, you might want to verify the blob's existence
  // or handle cases where the filename doesn't correspond to an existing blob.

  redirect(blobUrl);
}