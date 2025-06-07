'use client';

import { useRef, useLayoutEffect } from 'react';
import { useBibleSearchParams } from '../hooks';
import type { Verse } from '../model';
import { cn } from '@/shared';

function VerseList({ selectedVerses }: { selectedVerses: Verse[] }) {
  const { verseNumber } = useBibleSearchParams();
  const verseRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  useLayoutEffect(() => {
    const verseEl = verseRefs.current[Number(verseNumber)];
    if (!verseEl) return;

    verseEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, [verseNumber]);

  return (
    <div>
      {selectedVerses.map(({ verse, text }) => (
        <p
          className={cn(verse === Number(verseNumber) && 'underline')}
          key={verse}
          ref={(el) => {
            verseRefs.current[verse] = el;
          }}
        >
          <sup>{verse}</sup> {text}
        </p>
      ))}
    </div>
  );
}

export default VerseList;
