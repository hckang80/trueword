'use client';

import {
  Button,
  cn,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/shared';
import { ChevronDown, ListOrdered, SortAsc } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { type BibleBook, BibleChapterInstance } from '../model';

function BookSelector({
  books,
  bibleChapterInstance,
  changeBookChapter
}: {
  books: BibleBook[];
  bibleChapterInstance: BibleChapterInstance;
  changeBookChapter: (bookNumber: number, chapter: number) => void;
}) {
  const {
    book_name: selectedBookName,
    name: selectedChapterName,
    chapter: selectedChapterNumber
  } = bibleChapterInstance;
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'book' | 'asc'>('book');

  const sortedBooks = Object.values(books).toSorted((a, b) => {
    if (order === 'book') return a.bookid - b.bookid;
    return a.name.localeCompare(b.name);
  });

  const detailsRefs = useRef<Record<number, HTMLDetailsElement | null>>({});
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout | null>>({});

  const selectedChapterItem = (book: string, chapterNumber: number) =>
    book === selectedBookName && selectedChapterNumber === chapterNumber;

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
          <DrawerTitle className="sr-only">Bible</DrawerTitle>
          <DrawerDescription asChild>
            <div className="text-left">
              <div className="inline-flex gap-1 sticky top-0 left-full p-3">
                <Button
                  variant="outline"
                  disabled={order === 'book'}
                  onClick={() => setOrder('book')}
                >
                  <ListOrdered />
                  {t('bookOrder')}
                </Button>
                <Button
                  variant="outline"
                  disabled={order === 'asc'}
                  onClick={() => setOrder('asc')}
                >
                  <SortAsc />
                  {t('abcOrder')}
                </Button>
              </div>
              {sortedBooks.map(({ name: book, bookid: bookNumber, chapters }, index) => (
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
                    {Array.from({ length: chapters }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        disabled={selectedChapterItem(book, i + 1)}
                        onClick={() => {
                          changeBookChapter(bookNumber, i + 1);
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

export default BookSelector;
