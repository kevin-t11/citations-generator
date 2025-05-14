import { Citation, CitationRequestData } from '@/types/citation';

/**
 * Generate a citation using the API
 */
export async function generateCitation(data: CitationRequestData): Promise<Citation> {
  try {
    if (!data.format) {
      throw new Error('Citation format is required');
    }

    if (!data.sourceType) {
      throw new Error('Source type is required');
    }

    const response = await fetch(`/api/citation/${data.format}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate citation';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
        errorMessage = `Citation generation failed with status: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.citation) {
      throw new Error('Invalid response from server - missing citation text');
    }

    const citation: Citation = {
      id: result.id || Math.random().toString(36).substring(2, 9),
      citation: result.citation,
      format: data.format,
      sourceType: data.sourceType,
      // For PDFs, use fileId instead of sourceUrl
      fileId: data.sourceType === 'pdf' ? data.fileId : undefined,
      sourceUrl: data.sourceType === 'url' ? data.sourceUrl : undefined,
      title: result.title || data.title,
      authors: result.authors || data.authors,
      year: result.year || data.year,
      source: result.source || data.source,
      additionalInfo: result.additionalInfo || data.additionalInfo,
    };

    return citation;
  } catch (error) {
    throw error;
  }
}

/**
 * Save citation to local storage
 */
export function saveCitation(citation: Citation): void {
  try {
    // Get existing citations from localStorage
    const existingCitations = localStorage.getItem('citations');
    const citations: Citation[] = existingCitations ? JSON.parse(existingCitations) : [];

    // Add the new citation
    citations.push(citation);

    // Save back to localStorage
    localStorage.setItem('citations', JSON.stringify(citations));

    // Trigger storage event for cross-component communication
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    throw error;
  }
}

/**
 * Get all saved citations from local storage
 */
export function getSavedCitations(): Citation[] {
  try {
    const citationsStr = localStorage.getItem('citations');
    return citationsStr ? JSON.parse(citationsStr) : [];
  } catch {
    return [];
  }
}

/**
 * Delete a citation from local storage
 */
export function deleteCitation(id: string): void {
  try {
    const citations = getSavedCitations();
    const updatedCitations = citations.filter((citation) => citation.id !== id);
    localStorage.setItem('citations', JSON.stringify(updatedCitations));
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    throw error;
  }
}
