'use client';

import { BibleInstance } from '@/@types';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function Container({ data }: { data: BibleInstance }) {
  const books = data.books.map(({ name }) => name);

  console.log({ data, books });
  const [selectedBook, setSelectedBook] = useState('창세기');

  const chapters = useMemo(
    () => data.books.find((book) => book.name === selectedBook)?.chapters,
    [selectedBook]
  );

  const [selectedChapter, setSelectedChapter] = useState(1);

  const verses = useMemo(
    () => chapters?.find((chapter) => chapter.chapter === selectedChapter)?.verses,
    [books, selectedChapter]
  );

  const [selectedVerse, setSelectedVerse] = useState(1);

  return (
    <>
      <div className="flex gap-[4px]">
        <Select defaultValue={selectedBook} onValueChange={(value) => setSelectedBook(value)}>
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
        <Select
          defaultValue={'' + selectedChapter}
          onValueChange={(value) => setSelectedChapter(+value)}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Select a chapter" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: chapters?.length || 0 }, (_, i) => (
              <SelectItem value={`${i + 1}`} key={i}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <select name="" id="" onChange={(e) => setSelectedVerse(+e.currentTarget.value)}>
        {Array.from({ length: verses?.length || 0 }, (_, i) => (
          <option value={i + 1} key={i}>
            {i + 1}
          </option>
        ))}
      </select>
      <br />
      {selectedBook}({chapters?.length}) {selectedChapter}:{selectedVerse}
      <div>
        {verses?.map((verse) => (
          <p key={verse.verse}>
            <sup>{verse.verse}</sup> {verse.text}
          </p>
        ))}
      </div>
    </>
  );
}
