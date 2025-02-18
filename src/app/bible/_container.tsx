'use client';

import { BibleInstance } from '@/@types';
import { useCallback, useMemo, useState } from 'react';
import BookSelect from './BookSelect';
import ChapterSelect from './ChapterSelect';

export default function Container({ data }: { data: BibleInstance }) {
  const books = useMemo(() => data.books.map(({ name }) => name), [data.books]);

  const [selectedBook, setSelectedBook] = useState('창세기');

  const chapters = useMemo(
    () => data.books.find((book) => book.name === selectedBook)?.chapters || [],
    [data.books, selectedBook]
  );

  const [selectedChapter, setSelectedChapter] = useState(1);

  const verses = useMemo(
    () => chapters.find((chapter) => chapter.chapter === selectedChapter)?.verses,
    [chapters, selectedChapter]
  );

  const handleBookChange = useCallback((value: string) => {
    setSelectedBook(value);
    setSelectedChapter(1);
  }, []);

  const handleChapterChange = useCallback((value: number) => {
    setSelectedChapter(value);
  }, []);

  return (
    <>
      <div className="flex gap-[4px]">
        <BookSelect books={books} selectedBook={selectedBook} onChange={handleBookChange} />
        <ChapterSelect
          chaptersCount={chapters.length}
          selectedChapter={selectedChapter}
          onChange={handleChapterChange}
        />
      </div>

      <div>
        {verses?.map((verse) => (
          <p key={verse.verse}>
            <sup>{verse.verse}</sup> {verse.text}
          </p>
        ))}
      </div>
    </>
  );
}
