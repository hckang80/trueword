'use client';

import type { BibleInstance, Transition } from '@/@types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { cn, fetcher } from '@/lib/utils';

export default function Container({
  translations,
  data: initialData
}: {
  translations: Transition[];
  data: BibleInstance;
}) {
  const [selectedTranslation, setSelectedTranslation] = useState<Transition | undefined>(
    translations[0]
  );

  const { data } = useQuery({
    queryKey: ['bible', selectedTranslation],
    queryFn: () => fetcher<BibleInstance>(`/api/${selectedTranslation?.abbreviation}.json`),
    initialData
  });

  const books = useMemo(() => data.books.map(({ name }) => name), [data]);
  const [DEFAULT_BOOK] = books;
  const DEFAULT_CHAPTER = 1;

  const [selectedBook, setSelectedBook] = useState(DEFAULT_BOOK);

  useEffect(() => {
    handleBookChange(DEFAULT_BOOK);
  }, [DEFAULT_BOOK]);

  const chapters = useMemo(
    () => data.books.find((book) => book.name === selectedBook)?.chapters || [],
    [data, selectedBook]
  );

  const [selectedChapter, setSelectedChapter] = useState(DEFAULT_CHAPTER);

  const verses = useMemo(
    () => chapters.find((chapter) => chapter.chapter === selectedChapter)?.verses,
    [chapters, selectedChapter]
  );

  const handleBookChange = useCallback((value: string) => {
    setSelectedBook(value);
  }, []);

  const handleChapterChange = useCallback((value: number) => {
    setSelectedChapter(value);
  }, []);

  const handleTranslationChange = (value: string) => {
    setSelectedTranslation(() => translations.find(({ abbreviation }) => abbreviation === value));
  };

  return (
    <>
      <div className="flex gap-[4px]">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>{`${selectedBook} ${selectedChapter}`}</Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[calc(100vh-50px)] max-h-[calc(100dvh-50px)]">
            <DrawerHeader className="overflow-y-auto">
              <DrawerTitle className="hidden">Bible</DrawerTitle>
              <DrawerDescription asChild>
                <div className="text-left">
                  {data.books.map(({ name: book, chapters }) => (
                    <details name="books" key={book}>
                      <summary className={cn(book === selectedBook ? 'font-bold' : '')}>
                        {book}
                      </summary>
                      <div>
                        <ol className="grid grid-cols-5 gap-[4px]">
                          {Array.from({ length: chapters.length }, (_, i) => (
                            <li key={i}>
                              <DrawerClose asChild>
                                <button
                                  onClick={() => {
                                    handleBookChange(book);
                                    handleChapterChange(i + 1);
                                  }}
                                >
                                  {i + 1}
                                </button>
                              </DrawerClose>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </details>
                  ))}
                </div>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>

        <Select value={selectedTranslation?.abbreviation} onValueChange={handleTranslationChange}>
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
