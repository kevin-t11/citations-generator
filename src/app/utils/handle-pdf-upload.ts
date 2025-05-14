import { PDFMetadata } from '@/types/citation';

interface UploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  fileType: string;
  metadata: PDFMetadata;
  error?: string;
}

function validateFile(file: File): void {
  if (!file) {
    throw new Error('No file provided');
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file type - only PDFs allowed
  if (!file.type.includes('application/pdf')) {
    throw new Error('Only PDF files are supported');
  }
}

async function parseResponse(response: Response): Promise<UploadResponse> {
  const responseText = await response.text();

  // Check for HTML response (indicates server error)
  if (responseText.trim().startsWith('<!DOCTYPE html>') || responseText.includes('<html>')) {
    throw new Error('Server returned an error page');
  }

  try {
    const data = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(data?.error || `Server error (${response.status})`);
    }

    if (!data || !data.success || !data.fileId) {
      throw new Error('Invalid server response');
    }

    return data;
  } catch {
    throw new Error('Server response error');
  }
}

export async function uploadAndProcessFile(file: File): Promise<{
  fileId: string;
  fileName: string;
  metadata: PDFMetadata;
}> {
  try {
    validateFile(file);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await parseResponse(response);

    return {
      fileId: data.fileId,
      fileName: data.fileName || file.name,
      metadata: data.metadata || {
        title: file.name.replace(/\.[^/.]+$/, ''),
        authors: 'Unknown Author',
        year: new Date().getFullYear().toString(),
      },
    };
  } catch {
    throw new Error('Upload failed. Please try again with a different file.');
  }
}
