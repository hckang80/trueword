'use client';

import type { BibleInstance, SelectedBook, TransitionVersion } from '@/entities/bible';
import { fetchTranslationsByLanguage, getLocalizedTranslationVersions } from '@/features/bible';
import { bibleKeys, translationsKeys } from '@/shared';
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
  localizedTranslationVersions: TransitionVersion[];
  selectedTranslationVersion: TransitionVersion;
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
  data: initialData
}: {
  children: ReactNode;
  data: BibleInstance;
}) {
  const params = useParams<{ locale: string }>();
  const { locale: userLocale } = params;
  const searchParams = useSearchParams();
  const bibleLanguage = searchParams.get('bibleLanguage');
  const validLanguage = bibleLanguage || userLocale;
  const { data: localizedTranslationVersions = [] } = useQuery({
    ...translationsKeys.data(validLanguage),
    queryFn: () => getLocalizedTranslationVersions(validLanguage),
    staleTime: 1000 * 60 * 5
  });
  const [translation] = localizedTranslationVersions;
  const [selectedTranslationVersion, setSelectedTranslation] = useState<
    TransitionVersion | undefined
  >(translation);
  const previousDataRef = useRef<BibleInstance>(initialData);
  const previousBibleLanguageRef = useRef(validLanguage);

  const {
    data: { books },
    isFetching
  } = useQuery({
    ...bibleKeys.data(selectedTranslationVersion?.abbreviation || ''),
    queryFn: async () => {
      const data = await fetchTranslationsByLanguage(
        selectedTranslationVersion?.abbreviation || ''
      );
      previousDataRef.current = data;
      previousBibleLanguageRef.current = bibleLanguage || '';
      return data;
    },
    initialData: previousDataRef.current,
    staleTime: 1000 * 60 * 5
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
  }, [
    bibleLanguage,
    translation,
    setSelectedTranslation,
    resetBook,
    DEFAULT_BOOK,
    DEFAULT_CHAPTER
  ]);

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
      localizedTranslationVersions.find(({ abbreviation }) => abbreviation === value)
    );
  };

  if (!selectedTranslationVersion) throw new Error('No translation selected');

  return (
    // Context를 작게 분리하거나 Store를 사용하도록 개편 필요. 리랜더링 이슈
    <BibleContext.Provider
      value={{
        books,
        isChangingBookLanguage: isFetching,
        selectedChapterName,
        resetBook,
        selectedBook: selectedBookInstance,
        localizedTranslationVersions,
        selectedTranslationVersion,
        handleTranslationChange,
        selectedVerses
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}
