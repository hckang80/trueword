'use client';

import type { Verse } from '../model';

function VerseList({ selectedVerses }: { selectedVerses: Verse[] }) {
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

export default VerseList;
