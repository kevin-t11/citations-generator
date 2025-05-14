import { PDFMetadata } from '@/types/citation';
import pdfParse from 'pdf-parse';

// Specify Node.js runtime
export const runtime = 'nodejs';

interface PDFInfo {
  Title?: string;
  Author?: string;
  CreationDate?: string | number;
  Producer?: string;
  Creator?: string;
  Keywords?: string;
  [key: string]: string | number | undefined;
}

interface PDFData {
  text: string;
  info: PDFInfo;
}

/**
 * Safely extracts text content from PDF data
 */
async function extractPDFText(buffer: Buffer): Promise<PDFData> {
  try {
    const data = await pdfParse(buffer, {
      max: 10, // Parse first 10 pages for better metadata extraction
      version: 'default',
    });

    return {
      text: data.text || '',
      info: data.info || {},
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Extract title from PDF data
 */
function extractTitle(pdfText: string, pdfInfo: PDFInfo): string {
  if (pdfInfo?.Title) {
    const title = String(pdfInfo.Title).trim();
    if (title) return title;
  }

  const lines = pdfText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Usually the first substantial line that isn't a header like Abstract or Introduction
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].length > 10 && !lines[i].match(/^(abstract|introduction|copyright)/i)) {
      return lines[i].length > 100 ? lines[i].substring(0, 97) + '...' : lines[i];
    }
  }

  return 'Untitled Document';
}

/**
 * Extract authors from PDF data
 */
function extractAuthors(pdfText: string, pdfInfo: PDFInfo): string {
  if (pdfInfo?.Author) {
    const author = String(pdfInfo.Author).trim();
    if (author) return author;
  }

  // Extract from first page text
  const firstPageText = pdfText.split('\n').slice(0, 20).join(' ');

  // Common patterns for author listings in academic papers
  const authorPatterns = [
    /authors?[\s:]+([^.]+)/i,
    /by[\s:]+([^.]+)/i,
    /^([^,]+,[^,]+(?:,[^,]+)*)$/m,
  ];

  for (const pattern of authorPatterns) {
    const match = firstPageText.match(pattern);
    if (match && match[1] && match[1].length > 3 && match[1].length < 150) {
      return match[1].trim();
    }
  }

  return 'Unknown Author';
}

/**
 * Extract year from PDF data
 */
function extractYear(pdfText: string, pdfInfo: PDFInfo): string {
  if (pdfInfo?.CreationDate) {
    const dateStr = String(pdfInfo.CreationDate);
    const yearMatch = dateStr.match(/(\d{4})/);
    if (yearMatch) return yearMatch[1];
  }

  const yearMatches = pdfText.match(/\b(19\d{2}|20\d{2})\b/g);
  if (yearMatches && yearMatches.length > 0) {
    return yearMatches[0];
  }

  return new Date().getFullYear().toString();
}

/**
 * Extract source/publisher information
 */
function extractSource(pdfText: string, pdfInfo: PDFInfo): string | undefined {
  if (pdfInfo?.Producer) {
    const producer = String(pdfInfo.Producer).trim();
    if (producer) return producer;
  }

  // Try to identify journal information from text
  const firstPageText = pdfText.split('\n').slice(0, 50).join(' ');
  const journalPatterns = [
    /journal\s+of\s+([^,\.]+)/i,
    /in[\s:]+([^,\.]+journal[^,\.]+)/i,
    /proceedings\s+of\s+([^,\.]+)/i,
  ];

  for (const pattern of journalPatterns) {
    const match = firstPageText.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

/**
 * Extract additional information (volume, issue, pages, DOI)
 */
function extractAdditionalInfo(pdfText: string): string | undefined {
  const firstPageText = pdfText.split('\n').slice(0, 50).join(' ');

  const volumeMatch = firstPageText.match(/vol(?:ume)?\.?\s*(\d+)/i);
  const issueMatch = firstPageText.match(/(?:no|issue|num)\.?\s*(\d+)/i);
  const pagesMatch = firstPageText.match(/pages?\s*(\d+)[\s-–—]*(\d+)/i);
  const doiMatch = firstPageText.match(/doi:?\s*([^\s]+)/i);

  const parts = [];

  if (volumeMatch) parts.push(`Volume ${volumeMatch[1]}`);
  if (issueMatch) parts.push(`Issue ${issueMatch[1]}`);
  if (pagesMatch) parts.push(`pp. ${pagesMatch[1]}–${pagesMatch[2]}`);
  if (doiMatch) parts.push(`DOI: ${doiMatch[1]}`);

  return parts.length > 0 ? parts.join(', ') : undefined;
}

/**
 * Extract metadata from a PDF file
 */
export async function extractPDFMetadata(pdfData: ArrayBuffer): Promise<PDFMetadata> {
  try {
    if (!pdfData || pdfData.byteLength === 0) {
      throw new Error('Empty PDF data provided');
    }

    // Convert ArrayBuffer to Buffer for pdf-parse
    const buffer = Buffer.from(pdfData);
    if (buffer.length === 0) {
      throw new Error('PDF buffer conversion failed');
    }
    const { text, info } = await extractPDFText(buffer);

    return {
      title: extractTitle(text, info),
      authors: extractAuthors(text, info),
      year: extractYear(text, info),
      source: extractSource(text, info),
      additionalInfo: extractAdditionalInfo(text),
    };
  } catch {
    return {
      title: 'Error Processing PDF',
      authors: 'Unknown Author',
      year: new Date().getFullYear().toString(),
    };
  }
}
