'use client';

import {
  useBibleLanguage,
  useLocalizedTranslationVersions,
  useUpdateBibleParams,
  useBibleChapterInstance,
  useTranslationBooks,
  BookSelector,
  TranslationSelector,
  VerseList
} from '@/features/bible';
import { useSearchParams } from 'next/navigation';

export default function Container() {
  const searchParams = useSearchParams();
  const language = useBibleLanguage();
  const { data: localizedTranslationVersions } = useLocalizedTranslationVersions(language);
  const [translationVersion] = localizedTranslationVersions;
  const getTranslationVersionId =
    searchParams.get('abbreviation') || translationVersion.abbreviation;
  const getBookNumber = searchParams.get('bookNumber') || '1';
  const getChapterNumber = searchParams.get('chapterNumber') || '1';

  const { data: bibleChapterInstance } = useBibleChapterInstance([
    getTranslationVersionId,
    getBookNumber,
    getChapterNumber
  ]);

  const { data: books } = useTranslationBooks(getTranslationVersionId);

  const updateBibleParams = useUpdateBibleParams();

  const selectedBookName = bibleChapterInstance.book_name;
  const selectedChapterName = bibleChapterInstance.name || '';
  const selectedVerses = bibleChapterInstance.verses;

  const resetBook = (bookNumber: number, chapter: number) => {
    updateBibleParams({
      abbreviation: getTranslationVersionId,
      bookNumber,
      chapterNumber: chapter
    });
  };

  return (
    <div className="p-[var(--global-inset)]">
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector
          books={books}
          selectedChapterName={selectedChapterName}
          selectedBookName={selectedBookName}
          resetBook={resetBook}
        />
        <TranslationSelector
          localizedTranslationVersions={localizedTranslationVersions}
          bibleChapterInstance={bibleChapterInstance}
        />
      </div>
      <VerseList selectedVerses={selectedVerses} />
    </div>
  );
}
