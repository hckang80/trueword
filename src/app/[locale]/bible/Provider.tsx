'use client';

import type { BibleInstance, SelectedBook, Transition } from '@/entities/bible';
import { fetchTranslationsByLanguage } from '@/features/bible';
import { bibleKeys } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

type BibleContextType = {
  books: BibleInstance['books'];
  isChangingBookLanguage: boolean;
  selectedChapterName: string;
  resetBook: (book: string, chapter: number) => void;
  selectedBook: SelectedBook;
  translations: Transition[];
  filteredTranslations: Transition[];
  selectedTranslation: Transition;
  handleTranslationChange: (value: string) => void;
  selectedVerses: { verse: number; text: string }[];
};

const BibleContext = createContext<BibleContextType | null>(null);

export function useBible() {
  const context = useContext(BibleContext);
  if (!context) throw new Error('useBible must be used within a BibleProvider');

  return context;
}

export function BibleProvider({
  children,
  translations: validTranslations,
  data: initialData
}: {
  children: ReactNode;
  translations: Transition[];
  data: BibleInstance;
}) {
  const params = useParams();
  const { locale: userLocale } = params;
  const searchParams = useSearchParams();
  const bibleLanguage = searchParams.get('bibleLanguage');
  const validLanguage = bibleLanguage || userLocale;
  const filteredTranslations = useMemo(() => {
    return validTranslations.filter(({ lang }) => lang === validLanguage);
  }, [validTranslations, bibleLanguage, userLocale]);
  const [translation] = filteredTranslations;
  const [selectedTranslation, setSelectedTranslation] = useState<Transition | undefined>(
    translation
  );
  const previousDataRef = useRef<BibleInstance>(initialData);
  const previousBibleLanguageRef = useRef(validLanguage);
  const {
    data: { books },
    isFetching
  } = useQuery({
    ...bibleKeys.data(selectedTranslation?.abbreviation || ''),
    queryFn: async () => {
      const data = await fetchTranslationsByLanguage(selectedTranslation?.abbreviation || '');
      previousDataRef.current = data;
      previousBibleLanguageRef.current = bibleLanguage || '';
      return data;
    },
    initialData: previousDataRef.current
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
    if (bibleLanguage && previousBibleLanguageRef.current !== bibleLanguage) {
      setSelectedTranslation(translation);
    }
    resetBook(DEFAULT_BOOK, DEFAULT_CHAPTER);
  }, [translation, setSelectedTranslation, resetBook, DEFAULT_BOOK, DEFAULT_CHAPTER]);

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
    setSelectedTranslation(() =>
      filteredTranslations.find(({ abbreviation }) => abbreviation === value)
    );
  };

  if (!selectedTranslation) throw new Error('No translation selected');

  return (
    <BibleContext.Provider
      value={{
        books,
        isChangingBookLanguage: isFetching,
        selectedChapterName,
        resetBook,
        selectedBook: selectedBookInstance,
        translations: validTranslations,
        filteredTranslations: filteredTranslations,
        selectedTranslation,
        handleTranslationChange,
        selectedVerses
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}
