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

const utcDateKey = '2025-08-08';

export async function GET(request: NextRequest) {
  try {
    const locale = request.headers.get('Accept-Language') || DEFAULT_LOCALE;

    const todayVerse: Record<string, unknown> = {
      ['todayVerse:en:2025-08-08']: {
        lang: 'en',
        abbreviation: 'YLT',
        bookNumber: 63,
        verse: {
          chapter: 1,
          verse: 9,
          name: '2 John 1:9',
          text: 'every one who is transgressing, and is not remaining in the teaching of the Christ, hath not God; he who is remaining in the teaching of the Christ, this one hath both the Father and the Son;'
        }
      },
      ['todayVerse:ko:2025-08-08']: {
        lang: 'ko',
        abbreviation: 'KRV',
        bookNumber: 30,
        verse: {
          chapter: 7,
          verse: 4,
          name: '아모스서 7:4',
          text: '주 여호와께서 또 내게 보이신 것이 이러하니라 주 여호와께서 명하여 불로 징벌하게 하시니 불이 큰 바다를 삼키고 육지까지 먹으려 하는지라'
        }
      }
    };

    const key = `todayVerse:${locale}:${utcDateKey}`;
    const cached = todayVerse[key];

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
