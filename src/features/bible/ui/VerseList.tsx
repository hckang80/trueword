'use client';

import { useRef, useLayoutEffect } from 'react';
import type { Verse } from '../model';
import { cn } from '@/shared';
import sanitizeHtml from 'sanitize-html';

function VerseList({ selectedVerses, isRTL }: { selectedVerses: Verse[]; isRTL: boolean }) {
  const verseRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  useLayoutEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const [, verseNumber] = hash.split('#');
    const verseEl = verseRefs.current[Number(verseNumber)];
    if (!verseEl) return;

    verseEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, []);

  const sanitizedData = (text: string) => ({
    __html: sanitizeHtml(text.replace(/`{3,}/g, '').replace('html', ''))
  });

  return (
    <div dir={cn(isRTL && 'rtl')}>
      {selectedVerses.map(({ verse, text }) => (
        <p
          id={`${verse}`}
          key={verse}
          ref={(el) => {
            verseRefs.current[verse] = el;
          }}
        >
          <sup>{verse}</sup> <span dangerouslySetInnerHTML={sanitizedData(text)} />
        </p>
      ))}
    </div>
  );
}

export default VerseList;
