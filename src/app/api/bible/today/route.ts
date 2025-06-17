import {
  CHAPTER_LENGTH,
  fetchBibleInstance,
  fetchTranslationBooks,
  fetchTranslationVersions,
  getLanguageFullName
} from '@/features/bible';
import { DEFAULT_LOCALE, getRandomPositiveInt } from '@/shared';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const CACHE_TTL = 24 * 60 * 60;

const utcDateKey = new Date().toISOString().split('T')[0];

export async function GET(request: NextRequest) {
  try {
    const locale = request.headers.get('Accept-Language') || DEFAULT_LOCALE;

    const key = `todayVerse:${locale}:${utcDateKey}`;
    const cached = await redis.get<string>(key);

    if (cached) return NextResponse.json(cached);

    const translationVersions = await fetchTranslationVersions();
    const localizedTranslationVersion = translationVersions.find(
      ({ id }) => id === getLanguageFullName(locale, 'en')
    );

    if (!localizedTranslationVersion)
      return NextResponse.json({ error: 'Failed to fetch translation versions' }, { status: 500 });

    const abbreviation = localizedTranslationVersion.translations[0].short_name;
    const bookNumber = getRandomPositiveInt(Object.keys(CHAPTER_LENGTH).length);
    const chapterNumber = getRandomPositiveInt(CHAPTER_LENGTH[bookNumber]);
    const [verses, books] = await Promise.all([
      fetchBibleInstance([abbreviation, '' + bookNumber, '' + chapterNumber]),
      fetchTranslationBooks(abbreviation)
    ]);
    const bookInstance = books.find(({ bookid }) => bookid === bookNumber);
    if (!bookInstance) {
      return NextResponse.json({ error: 'Failed to fetch book instance' }, { status: 500 });
    }

    const { verse, text } = verses[getRandomPositiveInt(verses.length) - 1];
    const data = {
      lang: locale,
      abbreviation,
      bookNumber,
      verse: {
        chapter: chapterNumber,
        verse,
        name: `${bookInstance.name} ${chapterNumber}:${verse}`,
        text
      }
    };

    redis.set(key, data, { ex: CACHE_TTL });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching today's bible:", error);
    return NextResponse.json({ error: "Failed to fetch today's bible" }, { status: 500 });
  }
}
