'use client';

import {
  BibleNavigator,
  BookSelector,
  TranslationSelector,
  useBibleChapterInstance,
  useTranslationBooks,
  useTranslationVersions,
  useUpdateBibleParams,
  VerseList,
  VideoList
} from '@/features/bible';
import { useLocale } from 'next-intl';

export default function Container({ reference }: { reference: string[] }) {
  const locale = useLocale();
  const [getTranslationVersionId, , getChapterNumber] = reference;
  const { data: translationVersions } = useTranslationVersions();
  const translationVersion = translationVersions
    .map(({ translations }) => translations)
    .flat()
    .find(({ short_name }) => short_name === getTranslationVersionId);

  if (!translationVersion) {
    throw new Error(`Translation version with id ${getTranslationVersionId} not found`);
  }

  const {
    data: { book: getCurrentBook, verses }
  } = useBibleChapterInstance(reference);
  const { data: books } = useTranslationBooks(locale);

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
