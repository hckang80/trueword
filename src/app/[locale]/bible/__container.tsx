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
import { ChevronDown, Globe } from 'lucide-react';
import BibleLanguages from './BibleLanguages';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  useBibleLanguage,
  useLocalizedTranslationVersions,
  fetchBibleInstance,
  useBibleParamsChange
} from '@/features/bible';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { BibleInstance, Book, SelectedBook, TransitionVersion, Verse } from '@/entities/bible';
import { useSearchParams } from 'next/navigation';

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
  localizedTranslationVersions,
  bibleInstance
}: {
  localizedTranslationVersions: TransitionVersion[];
  bibleInstance: BibleInstance;
}) {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const changeParams = useBibleParamsChange();

  const handleTranslationVersionChange = (abbreviation: string) => {
    changeParams({ abbreviation });
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    setOpen(false);
  }, [searchParams.get('abbreviation')]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{bibleInstance.distribution_versification}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between p-[10px]">
            <span className="flex items-center gap-[4px]">
              <Globe />
              {t('language')}
            </span>
            <div className="flex items-center gap-[4px]">
              <BibleLanguages />
            </div>
          </div>
          <DrawerTitle className="hidden">Translations</DrawerTitle>
          <DrawerDescription asChild>
            <ul>
              {localizedTranslationVersions.map(
                ({ distribution_versification, abbreviation, description }) => (
                  <li key={abbreviation}>
                    <button
                      className={cn('w-full p-[10px] text-left')}
                      onClick={() => handleTranslationVersionChange(abbreviation)}
                    >
                      <em
                        className={cn(
                          'block text-[16px]',
                          abbreviation === bibleInstance.abbreviation ? 'font-bold' : ''
                        )}
                      >
                        {distribution_versification}
                      </em>
                      <span className="block text-[13px]">{description}</span>
                    </button>
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
  const searchParams = useSearchParams();
  const language = useBibleLanguage();
  const { data: localizedTranslationVersions } = useLocalizedTranslationVersions(language);
  const [translationVersion] = localizedTranslationVersions;
  const getTranslationVersionId =
    searchParams.get('abbreviation') || translationVersion.abbreviation;

  const { data: bibleInstance } = useSuspenseQuery({
    ...bibleKeys.data(getTranslationVersionId),
    queryFn: () => fetchBibleInstance(getTranslationVersionId),
    staleTime: Infinity
  });

  const { books } = bibleInstance;
  const [{ name: DEFAULT_BOOK }] = books;
  const DEFAULT_CHAPTER = 1;

  const [selectedBookInstance, setSelectedBookInstance] = useState<SelectedBook>({
    book: DEFAULT_BOOK,
    chapter: DEFAULT_CHAPTER
  });

  useEffect(() => {
    setSelectedBookInstance({
      book: DEFAULT_BOOK,
      chapter: DEFAULT_CHAPTER
    });
  }, [DEFAULT_BOOK]);

  const selectedChapters =
    books.find((book) => book.name === selectedBookInstance.book)?.chapters || [];
  const selectedChapterInstance = selectedChapters.find(
    (chapter) => chapter.chapter === selectedBookInstance.chapter
  );
  const selectedChapterName = selectedChapterInstance?.name || '';
  const selectedVerses = selectedChapterInstance?.verses || [];

  const resetBook = (book: string, chapter: number) => {
    setSelectedBookInstance({ book, chapter });
  };

  return (
    <div className="p-[var(--global-inset)]">
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector
          books={books}
          selectedChapterName={selectedChapterName}
          selectedBook={selectedBookInstance}
          resetBook={resetBook}
        />
        <TranslationSelector
          localizedTranslationVersions={localizedTranslationVersions}
          bibleInstance={bibleInstance}
        />
      </div>
      <VerseList selectedVerses={selectedVerses} />
    </div>
  );
}
