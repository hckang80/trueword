import { CHAPTER_LENGTH, fetchBibleInstance, fetchTranslationVersions } from '@/features/bible';
import { DEFAULT_LOCALE, getRandomPositiveInt } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const locale = request.headers.get('Accept-Language') || DEFAULT_LOCALE;
    const translationVersions = await fetchTranslationVersions();
    const localizedTranslationVersion = translationVersions.find(({ lang }) => lang === locale);

    if (!localizedTranslationVersion)
      return NextResponse.json({ error: 'Failed to fetch translation versions' }, { status: 500 });

    const bookNumber = getRandomPositiveInt(Object.keys(CHAPTER_LENGTH).length);
    const chapterNumber = getRandomPositiveInt(CHAPTER_LENGTH[bookNumber]);
    const { verses } = await fetchBibleInstance([
      localizedTranslationVersion.abbreviation,
      '' + bookNumber,
      '' + chapterNumber
    ]);
    const randomVerse = verses[getRandomPositiveInt(verses.length) - 1];

    return NextResponse.json(randomVerse);
  } catch (error) {
    console.error("Error fetching today's bible:", error);
    return NextResponse.json({ error: "Failed to fetch today's bible" }, { status: 500 });
  }
}
