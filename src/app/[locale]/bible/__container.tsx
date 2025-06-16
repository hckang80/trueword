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

export default function Container() {
  const language = useBibleLanguage();
  const {
    abbreviation: getAbbreviation,
    bookNumber: getBookNumber,
    chapterNumber: getChapterNumber
  } = useBibleSearchParams();
  const { data: localizedTranslationVersions } = useLocalizedTranslationVersions(language);
  const [translationVersion] = localizedTranslationVersions;
  const getTranslationVersionId = getAbbreviation || translationVersion.short_name;

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

  return (
    <div className="p-[var(--global-inset)]">
      <div className="flex gap-[4px] mb-[20px] sticky top-[20px]">
        <BookSelector
          books={books}
          bibleChapterInstance={bibleChapterInstance}
          changeBookChapter={changeBookChapter}
        />
        <TranslationSelector
          localizedTranslationVersions={localizedTranslationVersions}
          bibleChapterInstance={bibleChapterInstance}
        />
        <VideoList chapterName={bibleChapterInstance.name} />
      </div>
      <VerseList selectedVerses={verses} />
      <BibleNavigator changeBookChapter={changeBookChapter} />
    </div>
  );
}
