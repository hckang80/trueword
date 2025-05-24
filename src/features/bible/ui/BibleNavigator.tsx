'use client';

import { Button } from '@/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CHAPTER_LENGTH, useBibleSearchParams } from '..';

function BibleNavigator({
  changeBookChapter
}: {
  changeBookChapter: (bookNumber: number, chapter: number) => void;
}) {
  const { bookNumber: getBookNumber, chapterNumber: getChapterNumber } = useBibleSearchParams();

  const isFirstChapter = getChapterNumber === '1';
  const isLastChapter = +getChapterNumber === CHAPTER_LENGTH[getBookNumber];

  return (
    <div className="flex justify-between sticky bottom-18 mt-4">
      <Button
        disabled={isFirstChapter && getBookNumber === '1'}
        title="Previous Chapter"
        variant="outline"
        size="icon"
        onClick={() => changeBookChapter(+getBookNumber, +getChapterNumber - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        disabled={isLastChapter && getBookNumber === '66'}
        title="Next Chapter"
        variant="outline"
        size="icon"
        onClick={() => changeBookChapter(+getBookNumber, +getChapterNumber + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export default BibleNavigator;
