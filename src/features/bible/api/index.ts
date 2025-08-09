import { type BibleBook, type TodayVerse, type YouTubeVideo } from '@/features/bible';
import { axiosInstance, type Locale } from '@/shared';
import type {
  BibleBookResponse,
  BibleLanguage,
  BibleTransitionResponse,
  Verse,
  VerseResponse
} from '..';

export async function fetchTranslationVersions() {
  const { data } = await axiosInstance<Record<string, BibleTransitionResponse>>(
    '/api/translations'
  );
  const groupedByLanguage = Object.groupBy(Object.values(data), ({ lang_short }) => lang_short);

  return Object.entries(groupedByLanguage).map(([id, items]) => {
    if (!items) throw new Error('Grouped items not found');

    return {
      id,
      language: items[0].lang_native,
      translations: items.map((item) => ({
        short_name: item.module,
        full_name: item.name,
        year: item.year,
        ...(item.rtl && { dir: 'rtl' })
      }))
    } satisfies BibleLanguage;
  });
}

export async function fetchBibleInstance(
  params: string[]
): Promise<{ book: BibleBook; verses: Verse[] }> {
  const [abbreviation, bookNumber, chapterNumber] = params;
  const { data } = await axiosInstance<VerseResponse[]>(
    `/translations/${abbreviation}/${bookNumber}/${chapterNumber}`
  );
  const [{ book_id, book_name, chapter_verse, verses }] = data;

  return {
    book: {
      bookid: book_id,
      name: book_name,
      chapters: +chapter_verse
    },
    verses: Object.values(verses[abbreviation][chapterNumber])
  };
}

export async function fetchTranslationBooks(locale: Locale) {
  const { data } = await axiosInstance<BibleBookResponse[]>(`/translations/${locale}`);
  return data.map((item) => ({ ...item, bookid: item.id }));
}

export async function fetchYouTubeVideos(query: string) {
  const { data } = await axiosInstance.get<YouTubeVideo[]>('/api/video', {
    params: {
      q: query
    }
  });
  return data;
}

export async function fetchBibleToday(locale: Locale) {
  const { data } = await axiosInstance.get<TodayVerse>('/api/bible/today', {
    headers: {
      'Accept-Language': locale
    }
  });
  return data;
}
