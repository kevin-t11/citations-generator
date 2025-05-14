import { CitationRequestData } from '@/types/citation';

type FormatType = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee' | 'ama' | 'asa';

/**
 * Format author names for citation
 */
function formatAuthors(authors: string, formatType: FormatType): string {
  if (!authors) return '';

  // Split authors by comma or 'and'
  const authorList = authors.split(/,\s*|\s+and\s+|\s*&\s*/).filter(Boolean);

  const getNameParts = (author: string) => {
    const parts = author.trim().split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() || '' : parts[0];
    const firstName = parts.join(' ');
    const initials = parts.map((name) => name.charAt(0));
    return { lastName, firstName, initials };
  };

  switch (formatType) {
    case 'apa':
    case 'harvard':
      // Last, F. M., & Last, F. M.
      return authorList
        .map((author) => {
          const { lastName, initials } = getNameParts(author);
          return `${lastName}, ${initials.map((i) => `${i}.`).join(' ')}`;
        })
        .join(', ');

    case 'mla':
    case 'chicago':
    case 'asa':
      // First author: Last, First; Others: First Last
      return authorList
        .map((author, i) => {
          const { lastName, firstName } = getNameParts(author);
          return i === 0 ? `${lastName}, ${firstName}` : `${firstName} ${lastName}`;
        })
        .join(formatType === 'mla' ? ', and ' : ', and ');

    case 'ieee':
      // IEEE: F. M. Last, F. M. Last, and F. M. Last
      return authorList
        .map((author) => {
          const { lastName, initials } = getNameParts(author);
          return `${initials.map((i) => `${i}.`).join('. ')} ${lastName}`;
        })
        .join(', ');

    case 'ama':
      // AMA: Last FM, Last FM, Last FM
      return authorList
        .map((author) => {
          const { lastName, initials } = getNameParts(author);
          return `${lastName} ${initials.join('')}`;
        })
        .join(', ');

    default:
      return authors;
  }
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Extract information from additionalInfo field
 */
function extractMetadataComponents(additionalInfo?: string) {
  if (!additionalInfo) return {};

  const volumeMatch = additionalInfo.match(/Volume\s+(\d+)/i);
  const issueMatch = additionalInfo.match(/Issue\s+(\d+)/i);
  const pagesMatch = additionalInfo.match(/pp\.\s+(\d+)[\s–-]+(\d+)/i);
  const doiMatch = additionalInfo.match(/DOI:\s*([^\s.]+)/i);

  return {
    volume: volumeMatch ? volumeMatch[1] : undefined,
    issue: issueMatch ? issueMatch[1] : undefined,
    pages: pagesMatch ? { start: pagesMatch[1], end: pagesMatch[2] } : undefined,
    doi: doiMatch ? doiMatch[1] : undefined,
  };
}

/**
 * Format title based on source type and citation style
 */
function formatTitle(title: string, sourceType: string, style: FormatType): string {
  if (!title) return '';

  //Note: Books are typically italicized (would be handled with styling in the UI)
  // Articles/websites usually have quotes in certain styles
  if (sourceType === 'book') {
    return `${title}. `;
  } else if (['mla', 'chicago', 'asa', 'ieee'].includes(style)) {
    return `"${title}." `;
  } else {
    return `${title}. `;
  }
}

function addPublicationDetails(
  metadata: ReturnType<typeof extractMetadataComponents>,
  style: FormatType
): string {
  if (!metadata.volume && !metadata.issue && !metadata.pages) return '';

  let details = '';

  switch (style) {
    case 'apa':
    case 'harvard':
      if (metadata.volume) details += `, ${metadata.volume}`;
      if (metadata.issue) details += `(${metadata.issue})`;
      if (metadata.pages) details += `, ${metadata.pages.start}-${metadata.pages.end}`;
      break;

    case 'mla':
      if (metadata.volume) details += `, vol. ${metadata.volume}`;
      if (metadata.issue) details += `, no. ${metadata.issue}`;
      if (metadata.pages) details += `, pp. ${metadata.pages.start}-${metadata.pages.end}`;
      break;

    case 'chicago':
      if (metadata.volume) details += ` ${metadata.volume}`;
      if (metadata.issue) details += `, no. ${metadata.issue}`;
      if (metadata.pages) details += `: ${metadata.pages.start}–${metadata.pages.end}`;
      break;

    case 'ieee':
      if (metadata.volume) details += `, vol. ${metadata.volume}`;
      if (metadata.issue) details += `, no. ${metadata.issue}`;
      if (metadata.pages) details += `, pp. ${metadata.pages.start}–${metadata.pages.end}`;
      break;

    case 'ama':
      if (metadata.volume) details += `. ${metadata.volume}`;
      if (metadata.pages) details += `:${metadata.pages.start}-${metadata.pages.end}`;
      break;

    case 'asa':
      if (metadata.volume) details += ` ${metadata.volume}`;
      if (metadata.issue) details += `(${metadata.issue})`;
      if (metadata.pages) details += `:${metadata.pages.start}-${metadata.pages.end}`;
      break;
  }

  return details;
}

/**
 * Format DOI based on citation style
 */
function formatDOI(doi: string | undefined, style: FormatType): string {
  if (!doi) return '';

  switch (style) {
    case 'apa':
      return `https://doi.org/${doi}`;
    case 'ieee':
    case 'asa':
      return `doi: ${doi}. `;
    case 'ama':
      return `doi:${doi}. `;
    default:
      return `DOI: ${doi}. `;
  }
}

/**
 * Generate a citation based on data and format
 */
export function generateCitation(data: CitationRequestData): string {
  const format = data.format as FormatType;
  const meta = extractMetadataComponents(data.additionalInfo);

  let citation = '';

  // Author(s)
  if (data.authors) {
    citation += formatAuthors(data.authors, format);
    citation += format === 'apa' || format === 'harvard' ? ' ' : '. ';
  }

  // Year - formats vary by citation style
  if (data.year) {
    if (format === 'apa' || format === 'harvard') {
      citation += `(${data.year}). `;
    } else if (format === 'chicago') {
      citation += `(${data.year})`;

      if (meta.pages) {
        citation += `: ${meta.pages.start}–${meta.pages.end}`;
      }

      citation += '. ';
    } else if (format === 'asa') {
      citation += `${data.year}. `;
    } else if (format === 'ama') {
      citation += `Published ${data.year}. `;
    } else {
      citation += `${data.year}`;
      if (format === 'mla' && meta.pages) {
        citation += `, pp. ${meta.pages.start}-${meta.pages.end}`;
      }
      citation += '. ';
    }
  } else if (format === 'apa' || format === 'harvard') {
    citation += '(n.d.). ';
  }

  // Title
  if (data.title) {
    citation += formatTitle(data.title, data.sourceType, format);
  }

  // Source/Publisher with publication details
  if (data.source) {
    // Different format for each citation style
    if (format === 'mla') {
      citation += `${data.source}`;

      if (meta.volume) citation += `, vol. ${meta.volume}`;
      if (meta.issue) citation += `, no. ${meta.issue}`;

      citation += ', ';
    } else if (format === 'ieee') {
      citation += `${data.source}`;
      citation += addPublicationDetails(meta, format);
      citation += ', ';
    } else {
      citation += `${data.source}`;
      citation += addPublicationDetails(meta, format);

      if (!citation.endsWith('.')) citation += '.';
      citation += ' ';
    }
  }

  // DOI
  if (meta.doi) {
    citation += formatDOI(meta.doi, format);
  }

  // URL
  if (data.sourceUrl && data.sourceType === 'url') {
    switch (format) {
      case 'apa':
        citation += `Retrieved from ${data.sourceUrl}`;
        break;
      case 'mla':
        citation += `${data.sourceUrl}. Accessed ${getCurrentDate()}.`;
        break;
      case 'chicago':
        citation += `Accessed ${getCurrentDate()}. ${data.sourceUrl}.`;
        break;
      case 'harvard':
        citation += `Available at: ${data.sourceUrl} (Accessed: ${getCurrentDate()}).`;
        break;
      case 'ieee':
        citation += `[Online]. Available: ${data.sourceUrl}. [Accessed: ${getCurrentDate()}].`;
        break;
      case 'ama':
        citation += `Accessed ${getCurrentDate()}. ${data.sourceUrl}`;
        break;
      case 'asa':
        citation += `Retrieved ${getCurrentDate()} (${data.sourceUrl}).`;
        break;
    }
  }

  return citation.trim();
}

// Export specific style functions that just call the main function
export const generateAPACitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'apa' });

export const generateMLACitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'mla' });

export const generateChicagoCitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'chicago' });

export const generateHarvardCitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'harvard' });

export const generateIEEECitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'ieee' });

export const generateAMACitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'ama' });

export const generateASACitation = (data: CitationRequestData) =>
  generateCitation({ ...data, format: 'asa' });
