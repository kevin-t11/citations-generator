export interface Citation {
  id: string;
  citation: string;
  format: string;
  sourceType: string;
  sourceUrl?: string;
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
