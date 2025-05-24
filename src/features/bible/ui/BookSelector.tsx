'use client';

import {
  cn,
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/shared';
import { ChevronDown, ListOrdered, SortAsc } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { type TranslationBooks, BibleChapterInstance, CHAPTER_LENGTH } from '../model';

function BookSelector({
  books,
  bibleChapterInstance,
  changeBookChapter
}: {
  books: TranslationBooks;
  bibleChapterInstance: BibleChapterInstance;
  changeBookChapter: (bookNumber: number, chapter: number) => void;
}) {
  const {
    book_name: selectedBookName,
    name: selectedChapterName,
    chapter: selectedChapterNumber
  } = bibleChapterInstance;
  const [open, setOpen] = useState(false);

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
          <DrawerTitle className="hidden">Bible</DrawerTitle>
          <DrawerDescription asChild>
            <div className="text-left">
              <div className="inline-flex gap-1 sticky top-0 left-full p-3">
                <Button variant="outline">
                  <ListOrdered />
                  성경순
                </Button>
                <Button variant="outline">
                  <SortAsc />
                  ABC순
                </Button>
              </div>
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
