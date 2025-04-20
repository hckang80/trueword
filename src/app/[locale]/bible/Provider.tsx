'use client';

import type { BibleInstance, SelectedBook, TransitionVersion } from '@/entities/bible';
import {
  fetchTranslationsByLanguage,
  useBibleLanguage,
  useLocalizedTranslationVersions
} from '@/features/bible';
import { bibleKeys } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

type BibleContextType = {
  books: BibleInstance['books'];
  selectedChapterName: string;
  resetBook: (book: string, chapter: number) => void;
  selectedBook: SelectedBook;
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

export function BibleProvider({ children }: { children: ReactNode }) {
  const validLanguage = useBibleLanguage();
  const { data: localizedTranslationVersions = [] } =
    useLocalizedTranslationVersions(validLanguage);
  const [translation] = localizedTranslationVersions;
  const [selectedTranslationVersion, setSelectedTranslationVersion] = useState<
    TransitionVersion | undefined
  >(translation);

  const { data, isFetching } = useQuery({
    ...bibleKeys.data(selectedTranslationVersion?.abbreviation || ''),
    queryFn: () => fetchTranslationsByLanguage(selectedTranslationVersion?.abbreviation || ''),
    staleTime: 1000 * 60 * 5
  });

  const { books } = data || { books: [{ name: '', nr: 0, chapters: [] }] };
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
    if (!translation) return;
    setSelectedTranslationVersion(translation);
    resetBook(DEFAULT_BOOK, DEFAULT_CHAPTER);
  }, [translation, resetBook, DEFAULT_BOOK]);

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
    setSelectedTranslationVersion(() =>
      localizedTranslationVersions.find(({ abbreviation }) => abbreviation === value)
    );
  };

  if (!selectedTranslationVersion) throw new Error('No translation selected');

  return (
    // Context를 작게 분리하거나 Store를 사용하도록 개편 필요. 리랜더링 이슈
    <BibleContext.Provider
      value={{
        books,
        selectedChapterName,
        resetBook,
        selectedBook: selectedBookInstance,
        selectedTranslationVersion,
        handleTranslationChange,
        selectedVerses
      }}
    >
      {isFetching ? (
        <div className="center-absolute">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        children
      )}
    </BibleContext.Provider>
  );
}
