import { PDFMetadata } from '@/types/citation';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

// 10MB file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    if (!(file.type || '').includes('application/pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // Generate file ID and handle filename
    const fileId = uuidv4();
    const fileName = file.name.replace(/\s+/g, '_');
    const title = fileName.replace(/\.[^/.]+$/, '');

    // Create basic metadata from filename
    const metadata: PDFMetadata = {
      title,
      authors: 'Unknown Author',
      year: new Date().getFullYear().toString(),
    };

    return NextResponse.json({
      success: true,
      fileId,
      fileName,
      fileType: 'application/pdf',
      metadata,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
