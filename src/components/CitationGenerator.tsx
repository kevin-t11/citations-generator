'use client';
import { useCitations } from '@/app/hooks/use-citations';
import { generateCitation } from '@/app/utils/citation-service';
import { uploadAndProcessFile } from '@/app/utils/handle-pdf-upload';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CitationRequestData } from '@/types/citation';
import { SignInButton, useAuth } from '@clerk/nextjs';
import { Copy, Download, FileText, FileUp, Link as LinkIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import CslStyleSelector from './CslStyleSelector';

export default function CitationGenerator() {
  const { isSignedIn, isLoaded } = useAuth();
  const { addCitation } = useCitations();

  const [activeTab, setActiveTab] = useState('url');
  const [format, setFormat] = useState('apa');
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [manualInputs, setManualInputs] = useState({
    title: '',
    authors: '',
    year: '',
    source: '',
    additionalInfo: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileInput(e.target.files[0]);
    }
  };

  const handleManualInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setManualInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Validate inputs based on active tab
  const validateInputs = (): boolean => {
    if (activeTab === 'url' && !urlInput) {
      toast.error('Please enter a valid website URL');
      return false;
    }

    if (activeTab === 'pdf' && !fileInput) {
      toast.error('Please select a PDF file to upload');
      return false;
    }

    if (activeTab === 'manual' && (!manualInputs.title || !manualInputs.authors)) {
      toast.error('Please enter both title and authors');
      return false;
    }

    return true;
  };

  // Generate citation
  const handleGenerateCitation = async () => {
    if (!isSignedIn || !validateInputs()) return;

    setIsGenerating(true);
    setGeneratedCitation('');

    try {
      let requestData: CitationRequestData = {
        format,
        sourceType: activeTab,
      };

      // Add specific data based on the active tab
      if (activeTab === 'url') {
        requestData.sourceUrl = urlInput;
      } else if (activeTab === 'pdf' && fileInput) {
        try {
          const { fileId, fileName, metadata } = await uploadAndProcessFile(fileInput);
          requestData = {
            ...requestData,
            fileId, // Store the fileId separately
            title: metadata?.title || fileName.replace(/\.[^/.]+$/, ''),
            authors: metadata?.authors || '',
            year: metadata?.year || '',
            source: metadata?.source || 'Journal Article', // Default source type
            additionalInfo: metadata?.additionalInfo || '',
          };
        } catch {
          toast.error('Unable to process file. Please try a different file.');
          setIsGenerating(false);
          return;
        }
      } else if (activeTab === 'manual') {
        requestData = { ...requestData, ...manualInputs };
      }

      // Generate the citation
      const data = await generateCitation(requestData);
      setGeneratedCitation(data.citation);
      addCitation(data);
      toast.success('Citation generated successfully');
    } catch {
      toast.error('Unable to generate citation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCitation = () => {
    if (!generatedCitation) return;

    navigator.clipboard
      .writeText(generatedCitation)
      .then(() => toast.success('Citation copied to clipboard'))
      .catch(() => toast.error('Failed to copy citation'));
  };

  const handleDownloadCitation = () => {
    if (!generatedCitation) return;

    const element = document.createElement('a');
    const file = new Blob([generatedCitation], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `citation-${format}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Citation downloaded');
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-[300px]">Loading...</div>;
  }

  return (
    <section id="citationgenerator" className="py-10 md:py-14 bg-neutral-100">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-citation-700">
            Generate Your Citation
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium">
            Enter a URL, upload a PDF, or add details manually to generate a citation in any format.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-citation-200 shadow-md bg-[#fdf7f8]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Citation Generator</CardTitle>
              <CardDescription>Choose a method to generate your citation</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6">
                <CslStyleSelector value={format} onValueChange={setFormat} />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger
                    value="url"
                    className="flex items-center gap-2 data-[state=active]:bg-citation-100 data-[state=active]:text-citation-900"
                  >
                    <LinkIcon className="w-4 h-4" /> URL
                  </TabsTrigger>
                  <TabsTrigger
                    value="pdf"
                    className="flex items-center gap-2 data-[state=active]:bg-citation-100 data-[state=active]:text-citation-900"
                  >
                    <FileUp className="w-4 h-4" /> PDF
                  </TabsTrigger>
                  <TabsTrigger
                    value="manual"
                    className="flex items-center gap-2 data-[state=active]:bg-citation-100 data-[state=active]:text-citation-900"
                  >
                    <FileText className="w-4 h-4" /> Manual
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-4">
                  <div>
                    <Label htmlFor="url-input">Enter Website URL</Label>
                    <Input
                      id="url-input"
                      placeholder="https://example.com/article"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="pdf" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drop your PDF here, or{' '}
                      <span className="text-citation-500 font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF files only, maximum 10MB</p>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".pdf"
                    />
                    <Button
                      variant="outline"
                      className="mt-4 hover:border-citation-500 hover:text-citation-500"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Select File
                    </Button>
                    {fileInput && (
                      <p className="mt-2 text-sm text-citation-600">Selected: {fileInput.name}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Title of the paper or article"
                        value={manualInputs.title}
                        onChange={handleManualInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authors">Authors</Label>
                      <Input
                        id="authors"
                        placeholder="e.g., Smith, J., & Johnson, M."
                        value={manualInputs.authors}
                        onChange={handleManualInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          placeholder="Publication year"
                          value={manualInputs.year}
                          onChange={handleManualInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Input
                          id="source"
                          placeholder="Journal, book, website, etc."
                          value={manualInputs.source}
                          onChange={handleManualInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Volume, issue, pages, DOI, URL, etc."
                        value={manualInputs.additionalInfo}
                        onChange={handleManualInputChange}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex-col">
              {!isSignedIn ? (
                <div className="w-full">
                  <Button className="w-full bg-gray-400 hover:bg-gray-500 text-white mb-3" disabled>
                    Generate Citation
                  </Button>
                  <div className="rounded-lg p-4 bg-citation-50 border border-citation-200 text-center">
                    <p className="text-gray-800 font-medium mb-3">
                      Please sign in to generate and save citations
                    </p>
                    <SignInButton mode="modal">
                      <Button className="bg-citation-500 hover:bg-citation-700 text-white">
                        Sign In to Continue
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <Button
                    onClick={handleGenerateCitation}
                    className="w-full bg-citation-500 hover:bg-citation-700 text-white"
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Citation'}
                  </Button>
                </div>
              )}

              {generatedCitation && (
                <div className="mt-6 p-4 bg-citation-50 rounded-lg border border-citation-200 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Generated Citation</h4>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-citation-500"
                        onClick={handleCopyCitation}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-citation-500"
                        onClick={handleDownloadCitation}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{generatedCitation}</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
