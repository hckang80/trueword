'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Drawer,
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
  useUpdateBibleParams,
  fetchTranslationBooks
} from '@/features/bible';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  CHAPTER_LENGTH,
  type BibleChapterInstance,
  type TransitionVersion,
  type TranslationBooks,
  type Verse
} from '@/entities/bible';
import { useSearchParams } from 'next/navigation';

function BookSelector({
  books,
  selectedChapterName,
  selectedBookName,
  resetBook
}: {
  books: TranslationBooks;
  selectedChapterName: string;
  selectedBookName: string;
  resetBook: (bookNumber: number, chapter: number) => void;
}) {
  const [open, setOpen] = useState(false);

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

  const searchParams = useSearchParams();
  const bookNumber = searchParams.get('bookNumber');
  const chapterNumber = searchParams.get('chapterNumber');

  useEffect(() => {
    setOpen(false);
  }, [bookNumber, chapterNumber]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>{selectedChapterName}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <DrawerTitle className="hidden">Bible</DrawerTitle>
          <DrawerDescription asChild>
            <div className="text-left">
              {Object.values(books).map(({ name: book, nr: bookNumber }, index) => (
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
                      book === selectedBookName ? 'font-bold' : ''
                    )}
                  >
                    {book}
                    <ChevronDown size={20} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="grid grid-cols-5 gap-[4px] px-[10px]">
                    {Array.from({ length: CHAPTER_LENGTH[bookNumber] }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        onClick={() => {
                          resetBook(bookNumber, i + 1);
                        }}
                      >
                        {i + 1}
                      </Button>
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
  bibleChapterInstance
}: {
  localizedTranslationVersions: TransitionVersion[];
  bibleChapterInstance: BibleChapterInstance;
}) {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const updateBibleParams = useUpdateBibleParams();

  const handleTranslationVersionChange = (abbreviation: string) => {
    updateBibleParams({ abbreviation });
  };

  const searchParams = useSearchParams();
  const abbreviation = searchParams.get('abbreviation');
  const { distribution_versification: label } =
    localizedTranslationVersions.find((version) => version.abbreviation === abbreviation) ||
    localizedTranslationVersions[0];

  useEffect(() => {
    setOpen(false);
  }, [abbreviation]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{label}</Button>
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
                          abbreviation === bibleChapterInstance.abbreviation ? 'font-bold' : ''
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
  const getBookNumber = searchParams.get('bookNumber') || '1';
  const getChapterNumber = searchParams.get('chapterNumber') || '1';

  const { data: bibleChapterInstance } = useSuspenseQuery({
    ...bibleKeys.data([getTranslationVersionId, getBookNumber, getChapterNumber]),
    queryFn: () => fetchBibleInstance(getTranslationVersionId, getBookNumber, getChapterNumber),
    staleTime: Infinity
  });

  const { data: books } = useSuspenseQuery({
    queryKey: [getTranslationVersionId],
    queryFn: () => fetchTranslationBooks(getTranslationVersionId),
    staleTime: Infinity
  });

  const updateBibleParams = useUpdateBibleParams();

  const selectedBookName = bibleChapterInstance.book_name;
  const selectedChapterName = bibleChapterInstance.name || '';
  const selectedVerses = bibleChapterInstance.verses;

  const resetBook = (bookNumber: number, chapter: number) => {
    updateBibleParams({
      abbreviation: getTranslationVersionId,
      bookNumber,
      chapterNumber: chapter
    });
  };

  return (
    <div className="p-[var(--global-inset)]">
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector
          books={books}
          selectedChapterName={selectedChapterName}
          selectedBookName={selectedBookName}
          resetBook={resetBook}
        />
        <TranslationSelector
          localizedTranslationVersions={localizedTranslationVersions}
          bibleChapterInstance={bibleChapterInstance}
        />
      </div>
      <VerseList selectedVerses={selectedVerses} />
    </div>
  );
}
