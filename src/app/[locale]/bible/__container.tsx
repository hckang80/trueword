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
  const getTranslationVersionId = getAbbreviation || translationVersion.abbreviation;

  const { data: bibleChapterInstance } = useBibleChapterInstance([
    getTranslationVersionId,
    getBookNumber,
    getChapterNumber
  ]);

  const { data: books } = useTranslationBooks(getTranslationVersionId);

  const updateBibleParams = useUpdateBibleParams();

  const selectedVerses = bibleChapterInstance.verses;

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
      <VerseList selectedVerses={selectedVerses} />
      <BibleNavigator changeBookChapter={changeBookChapter} />
    </div>
  );
}
