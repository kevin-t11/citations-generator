import {
  generateAMACitation,
  generateAPACitation,
  generateASACitation,
  generateChicagoCitation,
  generateHarvardCitation,
  generateIEEECitation,
  generateMLACitation,
} from '@/app/utils/citation-generator';
import { fetchWebsiteMetadata } from '@/app/utils/website-parser';
import { Citation, CitationRequestData } from '@/types/citation';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest, { params }: { params: { format: string } }) {
  try {
    const format = params.format;
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
      } catch {
        // Continue with user-provided data if metadata fetch fails
      }
    }

    // Generate citation based on format
    let citation: string;
    switch (format) {
      case 'apa':
        citation = generateAPACitation(citationData);
        break;
      case 'mla':
        citation = generateMLACitation(citationData);
        break;
      case 'chicago':
        citation = generateChicagoCitation(citationData);
        break;
      case 'harvard':
        citation = generateHarvardCitation(citationData);
        break;
      case 'ieee':
        citation = generateIEEECitation(citationData);
        break;
      case 'ama':
        citation = generateAMACitation(citationData);
        break;
      case 'asa':
        citation = generateASACitation(citationData);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported citation format' }, { status: 400 });
    }

    const response: Citation = {
      id: uuidv4(),
      citation,
      format,
      sourceType: data.sourceType,
      sourceUrl: data.sourceUrl,
      title: citationData.title,
      authors: citationData.authors,
      year: citationData.year,
      source: citationData.source,
      additionalInfo: citationData.additionalInfo,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate citation';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
