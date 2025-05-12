declare module 'citation-js' {
  export default class Cite {
    data: any;
    constructor(input: any);
    static async(input: any): Promise<Cite>;
    format(
      type: 'bibliography' | 'data' | 'bibtex' | string,
      options?: {
        format?: 'text' | 'html' | 'string' | 'json';
        template?: string;
        lang?: string;
      }
    ): string;
  }
}
