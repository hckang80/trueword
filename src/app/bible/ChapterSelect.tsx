'use client';

import React, { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type ChapterSelectProps = {
  chaptersCount: number;
  selectedChapter: number;
  onChange: (value: number) => void;
};

export default function ChapterSelect({
  chaptersCount,
  selectedChapter,
  onChange
}: ChapterSelectProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(Number(value));
    },
    [onChange]
  );

  return (
    <Select value={String(selectedChapter)} onValueChange={handleChange}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Select a chapter" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: chaptersCount }, (_, i) => (
          <SelectItem value={`${i + 1}`} key={i}>
            {i + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
