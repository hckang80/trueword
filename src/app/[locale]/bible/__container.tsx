'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/shared/components/ui/drawer';

import { Button } from '@/shared/components/ui/button';
import { bibleKeys, cn } from '@/shared';
import { ChevronDown, Globe, LoaderCircle } from 'lucide-react';
import BibleLanguages from './BibleLanguages';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  useBibleStore,
  useBibleLanguage,
  useLocalizedTranslationVersions,
  fetchBibleInstance
} from '@/features/bible';
import { useQuery } from '@tanstack/react-query';
import type { Book, SelectedBook, TransitionVersion, Verse } from '@/entities/bible';

function BookSelector({
  books,
  selectedChapterName,
  selectedBook,
  resetBook
}: {
  books: Book[];
  selectedChapterName: string;
  selectedBook: SelectedBook;
  resetBook: (book: string, chapter: number) => void;
}) {
  const detailsRefs = useRef<Record<number, HTMLDetailsElement | null>>({});
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout | null>>({});

  const adjustPosition = (index: number) => {
    const details = detailsRefs.current[index];
    if (!details || !details.open) return;

    const viewportHeight = window.innerHeight;
    let rect: DOMRect | null = null;
    let timeout = timeoutRefs.current[index];

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      rect = details.getBoundingClientRect();

      const isOutside = rect.bottom > viewportHeight;

      if (isOutside) {
        details.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

      timeout = null;
    }, 100);
  };

  useEffect(() => {
    const timeouts = { ...timeoutRefs.current };

    return () => {
      Object.values(timeouts).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

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
              {books.map(({ name: book, chapters: { length } }, index) => (
                <details
                  name="books"
                  ref={(el) => {
                    detailsRefs.current[index] = el;
                  }}
                  key={book}
                  className="group transition-[max-height] duration-400 ease-in-out max-h-[80px] open:max-h-[8000px]"
                  onToggle={() => adjustPosition(index)}
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

function TranslationSelector({
  selectedTranslationVersion,
  handleTranslationVersionChange
}: {
  selectedTranslationVersion: TransitionVersion;
  handleTranslationVersionChange: (value: string) => void;
}) {
  const t = useTranslations('Common');
  const language = useBibleLanguage();

  const { data: localizedTranslationVersions = [] } = useLocalizedTranslationVersions(language);

  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{selectedTranslationVersion.distribution_versification}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between p-[10px]">
            <span className="flex items-center gap-[4px]">
              <Globe />
              {t('language')}
            </span>
            <div className="flex items-center gap-[4px]">
              <BibleLanguages setOpen={setOpen} />
            </div>
          </div>
          <DrawerTitle className="hidden">Translations</DrawerTitle>
          <DrawerDescription asChild>
            <ul>
              {localizedTranslationVersions.map(
                ({ distribution_versification, abbreviation, description }) => (
                  <li key={abbreviation}>
                    <DrawerClose asChild>
                      <button
                        className={cn('w-full p-[10px] text-left')}
                        onClick={() => handleTranslationVersionChange(abbreviation)}
                      >
                        <em
                          className={cn(
                            'block text-[16px]',
                            abbreviation === selectedTranslationVersion.abbreviation
                              ? 'font-bold'
                              : ''
                          )}
                        >
                          {distribution_versification}
                        </em>
                        <span className="block text-[13px]">{description}</span>
                      </button>
                    </DrawerClose>
                  </li>
                )
              )}
            </ul>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

function VerseList({ selectedVerses }: { selectedVerses: Verse[] }) {
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

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-[8px]">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton className="h-4 w-full" key={i} />
      ))}
    </div>
  );
}

export default function Container() {
  const language = useBibleLanguage();
  const { data: localizedTranslationVersions = [] } = useLocalizedTranslationVersions(language);
  const [translationVersion] = localizedTranslationVersions;
  const { bibleLanguage } = useBibleStore();

  const [selectedTranslationVersion, setSelectedTranslationVersion] =
    useState<TransitionVersion>(translationVersion);

  const getTranslationVersion = selectedTranslationVersion || translationVersion;
  const getTranslationVersionId = getTranslationVersion.abbreviation || '';

  const { data: bibleInstance } = useQuery({
    ...bibleKeys.data(getTranslationVersionId),
    queryFn: () => fetchBibleInstance(getTranslationVersionId),
    enabled: !!getTranslationVersionId,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = !bibleInstance || !translationVersion;

  const { books } = bibleInstance || { books: [{ name: '', nr: 0, chapters: [] }] };
  const [{ name: DEFAULT_BOOK }] = books;
  const DEFAULT_CHAPTER = 1;

  const [selectedBookInstance, setSelectedBookInstance] = useState<SelectedBook>({
    book: DEFAULT_BOOK,
    chapter: DEFAULT_CHAPTER
  });

  useEffect(() => {
    if (isLoading) return;

    setSelectedBookInstance({
      book: DEFAULT_BOOK,
      chapter: DEFAULT_CHAPTER
    });
    setSelectedTranslationVersion(getTranslationVersion);
  }, [
    isLoading,
    DEFAULT_BOOK,
    getTranslationVersion,
    setSelectedTranslationVersion,
    setSelectedBookInstance
  ]);

  useEffect(() => {
    if (!translationVersion) return;

    setSelectedTranslationVersion(translationVersion);
  }, [bibleLanguage, setSelectedTranslationVersion, translationVersion]);

  const selectedChapters =
    books.find((book) => book.name === selectedBookInstance.book)?.chapters || [];
  const selectedChapterInstance = selectedChapters.find(
    (chapter) => chapter.chapter === selectedBookInstance.chapter
  );
  const selectedChapterName = selectedChapterInstance?.name || '';
  const selectedVerses = selectedChapterInstance?.verses || [];

  const handleTranslationVersionChange = (value: string) => {
    const transitionVersion = localizedTranslationVersions.find(
      ({ abbreviation }) => abbreviation === value
    );
    if (!transitionVersion) return;
    setSelectedTranslationVersion(transitionVersion);
  };

  const resetBook = (book: string, chapter: number) => {
    setSelectedBookInstance({ book, chapter });
  };

  if (isLoading)
    return (
      <div className="center-absolute">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  return (
    <div className="p-[var(--global-inset)]">
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector
          books={books}
          selectedChapterName={selectedChapterName}
          selectedBook={selectedBookInstance}
          resetBook={resetBook}
        />
        {selectedTranslationVersion && (
          <TranslationSelector
            selectedTranslationVersion={selectedTranslationVersion}
            handleTranslationVersionChange={handleTranslationVersionChange}
          />
        )}
      </div>
      <VerseList selectedVerses={selectedVerses} />
    </div>
  );
}
