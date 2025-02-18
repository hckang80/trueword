'use client';

import { BibleInstance } from '@/@types';
import { useMemo, useState } from 'react';

export default function Container({ data }: { data: BibleInstance }) {
  const books = data.books.map(({ name }) => name);

  console.log({ data, books });
  const [selectedBook, setSelectedBook] = useState('창세기');

  const chapters = useMemo(
    () => data.books.find((book) => book.name === selectedBook)?.chapters,
    [selectedBook]
  );

  const [selectedChapter, setSelectedChapter] = useState(1);

  const verses = useMemo(
    () => chapters?.find((chapter) => chapter.chapter === selectedChapter)?.verses,
    [books, selectedChapter]
  );

  const [selectedVerse, setSelectedVerse] = useState(1);

  return (
    <>
      <select name="" id="" onChange={(e) => setSelectedBook(e.currentTarget.value)}>
        {books.map((book) => (
          <option value={book} key={book}>
            {book}
          </option>
        ))}
      </select>
      <select name="" id="" onChange={(e) => setSelectedChapter(+e.currentTarget.value)}>
        {Array.from({ length: chapters?.length || 0 }, (_, i) => (
          <option value={i + 1} key={i}>
            {i + 1}
          </option>
        ))}
      </select>
      <select name="" id="" onChange={(e) => setSelectedVerse(+e.currentTarget.value)}>
        {Array.from({ length: verses?.length || 0 }, (_, i) => (
          <option value={i + 1} key={i}>
            {i + 1}
          </option>
        ))}
      </select>
      <br />
      {selectedBook}({chapters?.length}) {selectedChapter}:{selectedVerse}
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
