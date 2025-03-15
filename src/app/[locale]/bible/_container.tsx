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
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import { cn } from '@/shared';
import { ChevronDown, Globe, LoaderCircle } from 'lucide-react';
import BibleLanguages from './BibleLanguages';
import { useTranslations } from 'next-intl';
import { useBible } from './Provider';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function BookSelector() {
  const { books, selectedChapterName, resetBook, selectedBook } = useBible();

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

function TranslationSelector({ isFetching }: { isFetching: boolean }) {
  const { filteredTranslations, selectedTranslation, handleTranslationChange } = useBible();
  const t = useTranslations('Common');

  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
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
            <div className="flex items-center gap-[4px]">
              {isFetching && <LoaderCircle className="animate-spin" size={16} />}
              <BibleLanguages setOpen={setOpen} />
            </div>
          </div>
          <DrawerTitle className="hidden">Translations</DrawerTitle>
          <DrawerDescription asChild>
            <ul>
              {filteredTranslations.map(
                ({ distribution_versification, abbreviation, description }) => (
                  <li key={abbreviation}>
                    <DrawerClose asChild>
                      <button
                        className={cn('w-full p-[10px] text-left')}
                        onClick={() => handleTranslationChange(abbreviation)}
                      >
                        <em
                          className={cn(
                            'block text-[16px]',
                            abbreviation === selectedTranslation.abbreviation ? 'font-bold' : ''
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
  const { isChangingBookLanguage } = useBible();
  const searchParams = useSearchParams();
  const bibleLanguage = searchParams.get('bibleLanguage');

  return (
    <>
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector />
        <TranslationSelector isFetching={isChangingBookLanguage} />
      </div>
      {bibleLanguage && isChangingBookLanguage ? <SkeletonCard /> : <VerseList />}
    </>
  );
}
