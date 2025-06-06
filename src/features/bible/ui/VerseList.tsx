'use client';

import { useRef, useEffect } from 'react';
import { useBibleSearchParams } from '../hooks';
import type { Verse } from '../model';

function VerseList({ selectedVerses }: { selectedVerses: Verse[] }) {
  const { verseNumber } = useBibleSearchParams();
  const verseRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  useEffect(() => {
    const verseEl = verseNumber && verseRefs.current[+verseNumber];
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
