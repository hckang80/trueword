'use client';

import type { BibleInstance, Transition } from '@/@types';
import { useCallback, useMemo, useState } from 'react';
import BookSelect from './BookSelect';
import ChapterSelect from './ChapterSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/utils';

export default function Container({
  translations,
  data
}: {
  translations: Transition[];
  data: BibleInstance;
}) {
  const [selectedTranslation, setSelectedTranslation] = useState<Transition | undefined>(
    translations[0]
  );

  const { data: bible } = useQuery({
    queryKey: ['bible', selectedTranslation],
    queryFn: () => fetcher<BibleInstance>(`/v2/${selectedTranslation?.abbreviation}.json`),
    initialData: data
  });

  console.log({ translations, data, bible });
  const books = useMemo(() => data.books.map(({ name }) => name), [data.books]);
  const [DEFAULT_BOOK] = books;
  const DEFAULT_CHAPTER = 1;

  const [selectedBook, setSelectedBook] = useState(DEFAULT_BOOK);

  const chapters = useMemo(
    () => data.books.find((book) => book.name === selectedBook)?.chapters || [],
    [data.books, selectedBook]
  );

  const [selectedChapter, setSelectedChapter] = useState(DEFAULT_CHAPTER);

  const verses = useMemo(
    () => chapters.find((chapter) => chapter.chapter === selectedChapter)?.verses,
    [chapters, selectedChapter]
  );

  const handleBookChange = useCallback((value: string) => {
    setSelectedBook(value);
    setSelectedChapter(DEFAULT_CHAPTER);
  }, []);

  const handleChapterChange = useCallback((value: number) => {
    setSelectedChapter(value);
  }, []);

  const handleChange = (value: string) => {
    setSelectedTranslation(() => translations.find(({ abbreviation }) => abbreviation === value));
  };

  return (
    <>
      <div className="flex gap-[4px]">
        <BookSelect books={books} selectedBook={selectedBook} onChange={handleBookChange} />
        <ChapterSelect
          chaptersCount={chapters.length}
          selectedChapter={selectedChapter}
          onChange={handleChapterChange}
        />

        <Select value={selectedTranslation?.abbreviation} onValueChange={handleChange}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a translation" />
          </SelectTrigger>
          <SelectContent>
            {translations.map(({ abbreviation, description }) => (
              <SelectItem value={abbreviation} key={abbreviation}>
                {description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <pre>{JSON.stringify(selectedTranslation, null, 2)}</pre>

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
