import { WebsiteMetadata } from '@/types/citation';
import { JSDOM } from 'jsdom';

export async function fetchWebsiteMetadata(url: string): Promise<WebsiteMetadata> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const metadata: WebsiteMetadata = {
      url: url,
      dateAccessed: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    };

    // Extract title
    const titleText =
      document.querySelector('title')?.textContent?.trim() ||
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');

    if (titleText) {
      metadata.title = titleText;
    }

    // Extract authors
    const authorMeta =
      document.querySelector('meta[name="author"]')?.getAttribute('content') ||
      document.querySelector('meta[property="article:author"]')?.getAttribute('content');

    if (authorMeta) {
      metadata.authors = authorMeta;
    } else {
      // Try to find authors in common elements
      const possibleAuthorElements = document.querySelectorAll('.author, .byline, [rel="author"]');
      if (possibleAuthorElements.length > 0) {
        const authorNames = Array.from(possibleAuthorElements)
          .map((el) => el.textContent?.trim())
          .filter(Boolean) as string[];

        if (authorNames.length > 0) {
          metadata.authors = authorNames.join(', ');
        }
      }
    }

    // Extract publication date
    const publishedDate =
      document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
      document.querySelector('meta[name="publication_date"]')?.getAttribute('content');

    if (publishedDate) {
      const date = new Date(publishedDate);
      if (!isNaN(date.getTime())) {
        metadata.datePublished = date.toISOString().split('T')[0];
        metadata.year = date.getFullYear().toString();
      }
    }

    // Extract publisher/source
    metadata.source =
      document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
      new URL(url).hostname.replace('www.', '');

    return metadata;
  } catch {
    throw new Error('Failed to fetch website metadata');
  }
}
