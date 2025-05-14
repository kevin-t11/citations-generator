'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Citation format options
const CITATION_FORMATS = [
  { value: 'apa', label: 'APA - 7th Edition' },
  { value: 'mla', label: 'MLA - 9th Edition' },
  { value: 'chicago', label: 'Chicago - 17th Edition' },
  { value: 'harvard', label: 'Harvard' },
  { value: 'ieee', label: 'IEEE' },
  { value: 'ama', label: 'AMA' },
  { value: 'asa', label: 'ASA' },
];

interface CslStyleSelectorProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (value: string) => void;
}

export default function CslStyleSelector({ value, onValueChange }: CslStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="citation-format">Citation Format</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="citation-format" className="w-full">
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          {CITATION_FORMATS.map((format) => (
            <SelectItem key={format.value} value={format.value}>
              {format.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
