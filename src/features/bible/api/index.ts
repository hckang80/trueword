import { type BibleBook, type TodayVerse, type YouTubeVideo } from '@/features/bible';
import { axiosInstance, type Locale } from '@/shared';
import type { BibleTransition, NewBibleBook, NewBibleTransition, NewVerse, NewVerses } from '..';

export async function fetchTranslationVersions() {
  const { data } = await axiosInstance<Record<string, NewBibleTransition>>('/api/translations');
  const groupedByLanguage = Object.groupBy(Object.values(data), ({ lang_short }) => lang_short);

  return Object.entries(groupedByLanguage).map(([id, items]) => {
    if (!items) throw new Error('Grouped items not found');

    return {
      id,
      language: items[0].lang_short,
      translations: items.map(
        (item) =>
          ({
            short_name: item.module,
            full_name: item.name,
            ...(item.rtl && { dir: 'rtl' })
          } satisfies BibleTransition)
      )
    };
  });
}

export async function fetchBibleInstance(
  params: string[]
): Promise<{ book: BibleBook; verses: NewVerse[] }> {
  const [abbreviation, bookNumber, chapterNumber] = params;
  const { data } = await axiosInstance<NewVerses[]>(
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
  const { data } = await axiosInstance<NewBibleBook[]>(`/translations/${locale}`);
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
