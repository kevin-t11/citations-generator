export interface Citation {
  id: string;
  citation: string;
  format: string;
  sourceType: string;
  sourceUrl?: string;
  fileId?: string;
  title?: string;
  authors?: string;
  year?: string;
  source?: string;
  additionalInfo?: string;
}

export interface CitationRequestData {
  format: string;
  sourceType: string;
  sourceUrl?: string;
  fileId?: string;
  title?: string;
  authors?: string;
  year?: string;
  source?: string;
  additionalInfo?: string;
}

export interface WebsiteMetadata {
  title?: string;
  authors?: string;
  year?: string;
  source?: string;
  publisher?: string;
  datePublished?: string;
  dateAccessed?: string;
  url?: string;
}

export interface PDFMetadata {
  title?: string;
  authors?: string;
  year?: string;
  source?: string;
  publisher?: string;
  datePublished?: string;
  additionalInfo?: string;
}

// CSL-JSON types
export interface CslJson {
  id: string;
  type: string;
  title: string;
  author: Array<{ family: string; given: string }>;
  issued?: { 'date-parts': number[][] };
  accessed: { 'date-parts': number[][] };
  volume?: string;
  issue?: string;
  'page-first'?: string;
  page?: string;
  'container-title'?: string;
  publisher?: string;
  'publisher-place'?: string;
  'event-place'?: string;
  URL?: string;
  DOI?: string;
  [key: string]: unknown;
}

export interface MetadataResult {
  volume?: string;
  issue?: string;
  pages?: {
    start: string;
    end: string;
  };
  doi?: string;
  publisherPlace?: string;
  eventPlace?: string;
  [key: string]: unknown;
}
