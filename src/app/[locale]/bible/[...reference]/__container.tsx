'use client';

import {
  useBibleLanguage,
  useLocalizedTranslationVersions,
  useUpdateBibleParams,
  useBibleChapterInstance,
  useTranslationBooks,
  BookSelector,
  TranslationSelector,
  VerseList,
  VideoList,
  BibleNavigator,
  useBibleSearchParams
} from '@/features/bible';

export default function Container({
  translationVersionCode: getTranslationVersionId
}: {
  translationVersionCode: string;
}) {
  const language = useBibleLanguage();
  const { bookNumber: getBookNumber, chapterNumber: getChapterNumber } = useBibleSearchParams();
  const { data: localizedTranslationVersions } = useLocalizedTranslationVersions(language);
  const [translationVersion] = localizedTranslationVersions;

  const { data: verses } = useBibleChapterInstance([
    getTranslationVersionId,
    getBookNumber,
    getChapterNumber
  ]);

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
