'use client';

import { Button } from '@/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBibleSearchParams } from '..';

function BibleNavigator({
  changeBookChapter
}: {
  changeBookChapter: (bookNumber: number, chapter: number) => void;
}) {
  const { bookNumber: getBookNumber, chapterNumber: getChapterNumber } = useBibleSearchParams();

  return (
    <div className="flex justify-between sticky bottom-18 mt-4">
      <Button
        title="Previous Chapter"
        variant="outline"
        size="icon"
        onClick={() => changeBookChapter(+getBookNumber, +getChapterNumber - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
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
