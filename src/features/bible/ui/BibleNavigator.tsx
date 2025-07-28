'use client';

import { Button } from '@/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { CHAPTER_LENGTH } from '..';

function BibleNavigator({
  changeBookChapter
}: {
  changeBookChapter: (bookNumber: number, chapter: number) => void;
}) {
  const {
    reference: [, getBookNumber, getChapterNumber]
  } = useParams<{ reference: string[] }>();

  const isFirstChapter = getChapterNumber === '1';
  const isLastChapter = +getChapterNumber === CHAPTER_LENGTH[getBookNumber];

  function prevChapter(bookNumber: number, chapterNumber: number) {
    if (isFirstChapter) return changeBookChapter(bookNumber - 1, CHAPTER_LENGTH[bookNumber - 1]);
    changeBookChapter(bookNumber, chapterNumber);
  }

  function nextChapter(bookNumber: number, chapterNumber: number) {
    if (isLastChapter) return changeBookChapter(bookNumber + 1, 1);
    changeBookChapter(bookNumber, chapterNumber);
  }

  return (
    <div className="flex justify-between sticky bottom-18 mt-4">
      <Button
        disabled={isFirstChapter && getBookNumber === '1'}
        title="Previous Chapter"
        variant="outline"
        size="icon"
        onClick={() => prevChapter(+getBookNumber, +getChapterNumber - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        disabled={isLastChapter && getBookNumber === '66'}
        title="Next Chapter"
        variant="outline"
        size="icon"
        onClick={() => nextChapter(+getBookNumber, +getChapterNumber + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export default BibleNavigator;
