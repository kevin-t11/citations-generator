import { CitationRequestData, CslJson, MetadataResult } from '@/types/citation';
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-csl';

// Map our format values to CSL style identifiers
const CSL_STYLE_MAPPING = {
  apa: 'apa',
  mla: 'modern-language-association',
  chicago: 'chicago-author-date',
  harvard: 'harvard1',
  ieee: 'ieee',
  ama: 'american-medical-association',
  asa: 'american-sociological-association',
};

export async function generateCslCitation(data: CitationRequestData): Promise<string> {
  try {
    // Convert our CitationRequestData to a CSL-JSON format
    const cslData = convertToCslJson(data);

    // Create a new Citation.js instance with our data
    const citation = new Cite(cslData);

    // Get the mapped CSL style
    const style = CSL_STYLE_MAPPING[data.format as keyof typeof CSL_STYLE_MAPPING] || 'apa';

    // Format the citation according to the requested style
    // Use 'html' as the format first, then extract the text to avoid bibliography format issues
    try {
      const formattedCitation = citation.format('bibliography', {
        format: 'text',
        template: style,
        lang: 'en-US',
      });
      return formattedCitation.trim();
    } catch {
      const htmlCitation = citation.format('bibliography', {
        format: 'html',
        template: style,
        lang: 'en-US',
      });
      // Remove HTML tags to get plain text
      const textCitation = htmlCitation.replace(/<[^>]*>/g, '');
      return textCitation.trim();
    }
  } catch (error) {
    console.error('Error generating CSL citation:', error);

    // Fallback to a basic citation format if CSL fails
    return generateFallbackCitation(data);
  }
}

// Convert our internal data format to CSL-JSON
function convertToCslJson(data: CitationRequestData): CslJson {
  const additionalMetadata = extractAdditionalMetadata(data.additionalInfo || '');

  let type = 'webpage'; // default
  if (data.sourceType === 'book') {
    type = 'book';
  } else if (data.sourceType === 'pdf') {
    // PDFs are typically articles, papers, or chapters
    type = 'article-journal';
    if (data.source?.toLowerCase().includes('conference')) {
      type = 'paper-conference';
    } else if (data.source?.toLowerCase().includes('book')) {
      type = 'chapter';
    }
  } else if (data.sourceType === 'manual') {
    // Determine type based on source field
    if (data.source?.toLowerCase().includes('journal')) {
      type = 'article-journal';
    } else if (data.source?.toLowerCase().includes('conference')) {
      type = 'paper-conference';
    } else if (data.source?.toLowerCase().includes('book')) {
      type = 'chapter';
    }
  }

  // Convert authors string to array of author objects
  const authors = data.authors ? parseAuthors(data.authors) : [];

  const cslJson: CslJson = {
    id: 'ITEM-1',
    type,
    title: data.title || 'Untitled',
    author: authors,
    issued: data.year ? { 'date-parts': [[parseInt(data.year, 10)]] } : undefined,
    accessed: {
      'date-parts': [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]],
    },
  };

  // Add source-specific properties
  if (type === 'article-journal') {
    cslJson['container-title'] = data.source || '';
    if (additionalMetadata.volume) cslJson.volume = additionalMetadata.volume;
    if (additionalMetadata.issue) cslJson.issue = additionalMetadata.issue;
    if (additionalMetadata.pages) {
      cslJson['page-first'] = additionalMetadata.pages.start;
      cslJson.page = `${additionalMetadata.pages.start}-${additionalMetadata.pages.end}`;
    }
  } else if (type === 'book' || type === 'chapter') {
    cslJson.publisher = data.source || '';
    cslJson['publisher-place'] = additionalMetadata.publisherPlace || '';
  } else if (type === 'paper-conference') {
    cslJson['container-title'] = data.source || '';
    cslJson['event-place'] = additionalMetadata.eventPlace || '';
  } else if (type === 'webpage') {
    cslJson['container-title'] = data.source || '';
    if (data.sourceType === 'url') {
      cslJson.URL = data.sourceUrl || '';
    }
  }

  if (additionalMetadata.doi) {
    cslJson.DOI = additionalMetadata.doi;
  }

  return cslJson;
}

// Parse author string into CSL-JSON author array
function parseAuthors(authorsString: string): Array<{ family: string; given: string }> {
  // Split authors by common separators
  const authorNames = authorsString.split(/\s*(?:,|\band\b|&)\s*/).filter(Boolean);

  return authorNames.map((authorName) => {
    // Handle different name formats (Last, First or First Last)
    const parts = authorName.trim().split(/\s+/);
    let family = '';
    let given = '';

    if (authorName.includes(',')) {
      // Format: Last, First
      const [last, ...first] = authorName.split(',');
      family = last.trim();
      given = first.join(',').trim();
    } else {
      // Format: First Last - assume last token is family name
      if (parts.length > 1) {
        family = parts.pop() || '';
        given = parts.join(' ');
      } else {
        family = authorName;
      }
    }

    return { family, given };
  });
}

function extractAdditionalMetadata(additionalInfo: string): MetadataResult {
  const metadata: MetadataResult = {};

  // Extract volume
  const volumeMatch = additionalInfo.match(/Volume\s+(\d+)/i);
  if (volumeMatch) metadata.volume = volumeMatch[1];

  // Extract issue
  const issueMatch = additionalInfo.match(/Issue\s+(\d+)/i);
  if (issueMatch) metadata.issue = issueMatch[1];

  // Extract pages
  const pagesMatch = additionalInfo.match(/pp\.\s+(\d+)[\s–-]+(\d+)/i);
  if (pagesMatch) {
    metadata.pages = {
      start: pagesMatch[1],
      end: pagesMatch[2],
    };
  }

  // Extract DOI
  const doiMatch = additionalInfo.match(/DOI:\s*([^\s.]+)/i);
  if (doiMatch) metadata.doi = doiMatch[1];

  // Extract publisher place
  const publisherPlaceMatch = additionalInfo.match(/Published in\s+([^,.]+)/i);
  if (publisherPlaceMatch) metadata.publisherPlace = publisherPlaceMatch[1];

  // Extract event place (for conferences)
  const eventPlaceMatch = additionalInfo.match(/Held in\s+([^,.]+)/i);
  if (eventPlaceMatch) metadata.eventPlace = eventPlaceMatch[1];

  return metadata;
}

// Fallback citation generator in case CSL processing fails
function generateFallbackCitation(data: CitationRequestData): string {
  const { authors, year, title, source, sourceUrl } = data;
  let citation = '';

  // Authors
  if (authors) {
    citation += authors;
    citation += '. ';
  }

  // Year
  if (year) {
    citation += `(${year}). `;
  }

  // Title
  if (title) {
    if (['mla', 'chicago', 'ieee'].includes(data.format)) {
      citation += `"${title}." `;
    } else {
      citation += `${title}. `;
    }
  }

  // Source
  if (source) {
    citation += `${source}. `;
  }

  // URL for web sources
  if (sourceUrl && data.sourceType === 'url') {
    citation += `Retrieved from ${sourceUrl}`;
  }

  return citation.trim();
}

// Wrapper functions for specific citation styles
export const generateApaCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'apa' });

export const generateMlaCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'mla' });

export const generateChicagoCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'chicago' });

export const generateHarvardCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'harvard' });

export const generateIeeeCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'ieee' });

export const generateAmaCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'ama' });

export const generateAsaCSL = (data: CitationRequestData) =>
  generateCslCitation({ ...data, format: 'asa' });
