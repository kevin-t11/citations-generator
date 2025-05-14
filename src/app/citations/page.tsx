'use client';

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Copy, ExternalLink, FileText, Pencil, PlusCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Citation {
  id: string;
  fileId?: string;
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

export default function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCitation, setCurrentCitation] = useState<Citation | null>(null);
  const [editForm, setEditForm] = useState({
    citation: '',
    title: '',
    authors: '',
    year: '',
    source: '',
    additionalInfo: '',
    sourceUrl: '',
  });

  useEffect(() => {
    const savedCitations = localStorage.getItem('citations');
    if (savedCitations) {
      setCitations(JSON.parse(savedCitations));
    }
  }, []);

  const handleCopyCitation = (citation: string) => {
    navigator.clipboard
      .writeText(citation)
      .then(() => {
        toast.success('Citation copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy citation');
      });
  };

  const handleOpenSource = (citation: Citation) => {
    if (citation.sourceType === 'url' && citation.sourceUrl) {
      // For URLs, open in a new tab
      window.open(citation.sourceUrl, '_blank', 'noopener,noreferrer');
    } else if (citation.sourceType === 'pdf' && citation.fileId) {
      // For PDFs, show a notification with the file ID
      toast.info(`PDF Reference ID: ${citation.fileId}`, {
        description: 'In a production app, this would open the PDF from storage.',
        duration: 5000,
      });
    }
  };

  const handleEditCitation = (citation: Citation) => {
    setCurrentCitation(citation);
    setEditForm({
      citation: citation.citation,
      title: citation.title || '',
      authors: citation.authors || '',
      year: citation.year || '',
      source: citation.source || '',
      additionalInfo: citation.additionalInfo || '',
      sourceUrl: citation.sourceUrl || '',
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!currentCitation) return;

    const updatedCitations = citations.map((cit) => {
      if (cit.id === currentCitation.id) {
        return {
          ...cit,
          citation: editForm.citation,
          title: editForm.title,
          authors: editForm.authors,
          year: editForm.year,
          source: editForm.source,
          additionalInfo: editForm.additionalInfo,
          sourceUrl: editForm.sourceUrl,
        };
      }
      return cit;
    });

    setCitations(updatedCitations);
    localStorage.setItem('citations', JSON.stringify(updatedCitations));
    setIsEditing(false);
    setCurrentCitation(null);

    toast.success('Citation updated successfully');
  };

  const handleRemoveCitation = (id: string) => {
    const updatedCitations = citations.filter((citation) => citation.id !== id);
    setCitations(updatedCitations);
    localStorage.setItem('citations', JSON.stringify(updatedCitations));

    toast.success('Citation removed');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (citations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <FileText className="h-16 w-16 text-citation-400" />
            </div>
            <h2 className="text-2xl font-bold text-citation-700 mb-2">No Saved Citations</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven&apos;t generated any citations yet. Create your first citation to get
              started.
            </p>
            <Button
              onClick={() => {
                // Update URL to switch tab to generate
                const url = new URL(window.location.href);
                url.searchParams.set('tab', 'generate');
                window.history.pushState({}, '', url);
                // Trigger tab change event
                window.dispatchEvent(new Event('storage'));
              }}
              className="bg-citation-500 hover:bg-citation-700 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Citation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-citation-700">Your Citations</h1>
        <p className="text-gray-600">
          You have generated {citations.length} citation{citations.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6">
        {citations.map((citation) => (
          <Card key={citation.id} className="border-citation-200 shadow-md bg-[#fdf7f8]">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg text-citation-700">
                  {citation.title ||
                    (citation.format ? citation.format.toUpperCase() : 'Unknown') + ' Citation'}
                </CardTitle>
                <CardDescription>
                  {citation.sourceType} |{' '}
                  {citation.format ? citation.format.toUpperCase() : 'UNKNOWN'}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-500"
                onClick={() => handleRemoveCitation(citation.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">{citation.citation}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-citation-600 border-citation-200 hover:bg-citation-50"
                  onClick={() => handleEditCitation(citation)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                {(citation.sourceUrl || (citation.sourceType === 'pdf' && citation.fileId)) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-citation-600 border-citation-200 hover:bg-citation-50"
                    onClick={() => handleOpenSource(citation)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Open
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-citation-600 border-citation-200 hover:bg-citation-50"
                onClick={() => handleCopyCitation(citation.citation)}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Citation</SheetTitle>
            <SheetDescription>Make changes to your citation here</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="citation">Citation Text</Label>
              <Textarea
                id="citation"
                name="citation"
                value={editForm.citation}
                onChange={handleInputChange}
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authors">Authors</Label>
                <Input
                  id="authors"
                  name="authors"
                  value={editForm.authors}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" value={editForm.year} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  name="source"
                  value={editForm.source}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={editForm.additionalInfo}
                onChange={handleInputChange}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                id="sourceUrl"
                name="sourceUrl"
                value={editForm.sourceUrl}
                onChange={handleInputChange}
                type="url"
              />
            </div>
          </div>
          <SheetFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              className="bg-citation-500 hover:bg-citation-700 text-white"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
