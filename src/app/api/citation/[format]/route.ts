import { fetchWebsiteMetadata } from '@/app/utils/website-parser';
import { generateCslCitation } from '@/lib/csl-citation-generator';
import { Citation, CitationRequestData } from '@/types/citation';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest, { params }: { params: { format: string } }) {
  try {
    const { format } = params;
    const data: CitationRequestData = await request.json();

    if (!format || !data.sourceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let citationData = { ...data };

    // If URL source, trying to fetch metadata
    if (data.sourceType === 'url' && data.sourceUrl) {
      try {
        const metadata = await fetchWebsiteMetadata(data.sourceUrl);
        citationData = {
          ...citationData,
          ...metadata,
        };
      } catch (error) {
        console.error('Error fetching website metadata:', error);
        // Continue with user-provided data if metadata fetch fails
      }
    }

    // Generate citation using CSL (Citation Style Language)
    let citation;
    try {
      citation = await generateCslCitation({
        ...citationData,
        format,
      });
    } catch (error) {
      console.error('Error in CSL citation generation:', error);
      // If CSL citation generation fails, create a basic citation
      const { authors, year, title, source } = citationData;
      citation =
        [
          authors,
          year ? `(${year})` : '',
          title ? `"${title}"` : '',
          source || '',
          data.sourceUrl || '',
        ]
          .filter(Boolean)
          .join('. ')
          .replace(/\.{2,}/g, '.') + '.';
    }

    const response: Citation = {
      id: uuidv4(),
      citation,
      format,
      sourceType: data.sourceType,
      sourceUrl: data.sourceType === 'url' ? data.sourceUrl : undefined,
      fileId: data.sourceType === 'pdf' ? data.fileId : undefined,
      title: citationData.title,
      authors: citationData.authors,
      year: citationData.year,
      source: citationData.source,
      additionalInfo: citationData.additionalInfo,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate citation';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
