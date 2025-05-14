declare module '@citation-js/core' {
  export class Cite {
    constructor(data: Record<string, unknown>);
    format(
      output: 'bibliography' | 'data' | 'bibtex' | string,
      options: {
        format: 'text' | 'html' | 'string' | 'json';
        template: string;
        lang: string;
      }
    ): string;
  }
}
