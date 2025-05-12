declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    info: {
      Title?: string;
      Author?: string;
      Creator?: string;
      CreationDate?: string | number;
      Producer?: string;
      Keywords?: string;
      [key: string]: string | number | undefined;
    };
    metadata: {
      [key: string]: string | number | undefined;
    };
    version: string;
    numpages: number;
  }

  function pdfParse(buffer: Buffer, options?: any): Promise<PDFData>;

  export = pdfParse;
}
