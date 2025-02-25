'use client';

import type { BibleInstance, Transition } from '@/@types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { ChevronDown, Globe } from 'lucide-react';
import Locales from './locales';
import { useTranslations } from 'next-intl';

type SelectedBook = {
  book: string;
  chapter: number;
};

type BibleContextType = {
  books: BibleInstance['books'];
  selectedChapterName: string;
  resetBook: (book: string, chapter: number) => void;
  selectedBook: SelectedBook;
  translations: Transition[];
  selectedTranslation: Transition;
  handleTranslationChange: (value: string) => void;
  selectedVerses: { verse: number; text: string }[];
};

const BibleContext = createContext<BibleContextType | null>(null);

function useBible() {
  const context = useContext(BibleContext);
  if (!context) throw new Error('useBible must be used within a BibleProvider');

  return context;
}

function BookSelector() {
  const { books, selectedChapterName, resetBook, selectedBook } = useBible();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>{selectedChapterName}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <DrawerTitle className="hidden">Bible</DrawerTitle>
          <DrawerDescription asChild>
            <div className="text-left">
              {books.map(({ name: book, chapters: { length } }) => (
                <details
                  name="books"
                  key={book}
                  className="group transition-[max-height] duration-400 ease-in-out max-h-[80px] open:max-h-[800px]"
                >
                  <summary
                    className={cn(
                      'flex justify-between p-[10px]',
                      book === selectedBook.book ? 'font-bold' : ''
                    )}
                  >
                    {book}
                    <ChevronDown size={20} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="grid grid-cols-5 gap-[4px] px-[10px]">
                    {Array.from({ length }, (_, i) => (
                      <DrawerClose key={i} asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            resetBook(book, i + 1);
                          }}
                        >
                          {i + 1}
                        </Button>
                      </DrawerClose>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

function TranslationSelector() {
  const { translations, selectedTranslation, handleTranslationChange } = useBible();
  const t = useTranslations('Common');

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>{selectedTranslation.distribution_versification}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between p-[10px]">
            <span className="flex items-center gap-[4px]">
              <Globe />
              {t('language')}
            </span>
            <Locales />
          </div>
          <DrawerTitle className="hidden">Translations</DrawerTitle>
          <DrawerDescription asChild>
            <ul>
              {translations.map(({ distribution_versification, abbreviation, translation }) => (
                <li key={abbreviation}>
                  <DrawerClose asChild>
                    <button
                      className={cn(
                        'w-full p-[10px] text-left',
                        abbreviation === selectedTranslation.abbreviation ? 'font-bold' : ''
                      )}
                      onClick={() => handleTranslationChange(abbreviation)}
                    >
                      {`${distribution_versification}(${translation})`}
                    </button>
                  </DrawerClose>
                </li>
              ))}
            </ul>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

function VerseList() {
  const { selectedVerses } = useBible();

  return (
    <div>
      {selectedVerses.map(({ verse, text }) => (
        <p key={verse}>
          <sup>{verse}</sup> {text}
        </p>
      ))}
    </div>
  );
}

export default function Container({
  translations,
  data: initialData
}: {
  translations: Transition[];
  data: BibleInstance;
}) {
  const [translation] = translations;
  const [selectedTranslation, setSelectedTranslation] = useState<Transition | undefined>(
    translation
  );

  // TODO: 바로 윗 줄 useState에서 selectedTranslation와 translation의 초기값이 다르게 찍혀서 해결을 위해 추가
  useEffect(() => {
    setSelectedTranslation(translation);
  }, [translation, setSelectedTranslation]);

  const {
    data: { books }
  } = useQuery({
    queryKey: ['bible', selectedTranslation],
    queryFn: () => fetcher<BibleInstance>(`/api/${selectedTranslation?.abbreviation}.json`),
    initialData
  });

  const [{ name: DEFAULT_BOOK }] = books;
  const DEFAULT_CHAPTER = 1;

  const [selectedBookInstance, setSelectedBookInstance] = useState<SelectedBook>({
    book: DEFAULT_BOOK,
    chapter: DEFAULT_CHAPTER
  });

  const resetBook = useCallback((book: string, chapter: number) => {
    setSelectedBookInstance({ book, chapter });
  }, []);

  useEffect(() => {
    resetBook(DEFAULT_BOOK, DEFAULT_CHAPTER);
  }, [resetBook, DEFAULT_BOOK, DEFAULT_CHAPTER]);

  const selectedChapters = useMemo(
    () => books.find((book) => book.name === selectedBookInstance.book)?.chapters || [],
    [books, selectedBookInstance]
  );

  const selectedChapterInstance = useMemo(
    () => selectedChapters.find((chapter) => chapter.chapter === selectedBookInstance.chapter),
    [selectedChapters, selectedBookInstance]
  );

  const selectedChapterName = selectedChapterInstance?.name || '';
  const selectedVerses = selectedChapterInstance?.verses || [];

  const handleTranslationChange = (value: string) => {
    setSelectedTranslation(() => translations.find(({ abbreviation }) => abbreviation === value));
  };

  if (!selectedTranslation) throw new Error('No translation selected');

  return (
    <BibleContext.Provider
      value={{
        books,
        selectedChapterName,
        resetBook,
        selectedBook: selectedBookInstance,
        translations,
        selectedTranslation,
        handleTranslationChange,
        selectedVerses
      }}
    >
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector />
        <TranslationSelector />
      </div>
      <VerseList />
    </BibleContext.Provider>
  );
}
