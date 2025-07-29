'use client';

import {
  useUpdateBibleParams,
  useBibleChapterInstance,
  useTranslationBooks,
  BookSelector,
  TranslationSelector,
  VerseList,
  VideoList,
  BibleNavigator,
  useTranslationVersions
} from '@/features/bible';

export default function Container({ reference }: { reference: string[] }) {
  const [getTranslationVersionId, getBookNumber, getChapterNumber] = reference;
  const { data: translationVersions } = useTranslationVersions();
  const translationVersion = translationVersions
    .map(({ translations }) => translations)
    .flat()
    .find(({ short_name }) => short_name === getTranslationVersionId);

  if (!translationVersion) {
    throw new Error(`Translation version with id ${getTranslationVersionId} not found`);
  }

  const { data: verses } = useBibleChapterInstance(reference);
  const { data: books } = useTranslationBooks(getTranslationVersionId);
  const getCurrentBook = books.find(({ bookid }) => bookid === +getBookNumber);

  if (!getCurrentBook) {
    throw new Error(
      `Book with id ${getBookNumber} not found in translation ${getTranslationVersionId}`
    );
  }

  const bibleChapterInstance = {
    abbreviation: getTranslationVersionId,
    book_name: getCurrentBook.name,
    name: `${getCurrentBook.name} ${getChapterNumber}`,
    chapter: +getChapterNumber
  };

  const updateBibleParams = useUpdateBibleParams();

  const changeBookChapter = (bookNumber: number, chapter: number) => {
    updateBibleParams({
      abbreviation: getTranslationVersionId,
      bookNumber,
      chapterNumber: chapter
    });
  };

  const isRTL = translationVersion.dir === 'rtl';

  return (
    <div className="p-[var(--global-inset)]">
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector
          books={books}
          bibleChapterInstance={bibleChapterInstance}
          changeBookChapter={changeBookChapter}
        />
        <TranslationSelector getTranslationVersionId={getTranslationVersionId} />
        <VideoList chapterName={bibleChapterInstance.name} />
      </div>
      <VerseList selectedVerses={verses} isRTL={isRTL} />
      <BibleNavigator changeBookChapter={changeBookChapter} />
    </div>
  );
}
