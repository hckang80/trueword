'use client';

import { cn } from '@/shared/lib';
import { useLayoutEffect, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import type { Verse } from '../model';

function VerseList({ selectedVerses, isRTL }: { selectedVerses: Verse[]; isRTL: boolean }) {
  const verseRefs = useRef<Record<number, HTMLParagraphElement | null>>({});
  const [currentHash, setCurrentHash] = useState('');

  useLayoutEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const [, verseNumber] = hash.split('#');
    const verseEl = verseRefs.current[Number(verseNumber)];
    setCurrentHash(verseNumber);
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
          className={cn('scroll-mt-20', +currentHash === verse && 'underline decoration-dashed')}
        >
          <sup>{verse}</sup> <span dangerouslySetInnerHTML={sanitizedData(text)} />
        </p>
      ))}
    </div>
  );
}

export default VerseList;
