'use client';

import React, { memo, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type BookSelectProps = {
  books: string[];
  selectedBook: string;
  onChange: (value: string) => void;
};

const BookSelect: React.FC<BookSelectProps> = ({ books, selectedBook, onChange }) => {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange]
  );

  return (
    <Select defaultValue={selectedBook} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select a bible" />
      </SelectTrigger>
      <SelectContent>
        {books.map((book) => (
          <SelectItem value={book} key={book}>
            {book}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default memo(BookSelect);
