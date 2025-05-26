import { axiosInstance, toReadableDate } from '@/shared';
import { getNewsItem, type NewsItemType } from '@/features/news';

export * from './fetchNewsFeed';

export async function fetchNews(locale: string): Promise<NewsItemType[]> {
  const { data } = await axiosInstance<NewsItemType[]>('/api/news');

  return data.map((item) => ({ ...item, pubDate: toReadableDate(new Date(item.pubDate), locale) }));
}

export async function fetchNewsItem(
  [sourceName, guid]: string[],
  locale: string
): Promise<NewsItemType> {
  const data = await fetchNews(locale);
  const result = getNewsItem(data, [sourceName, guid]);
  if (!result) throw Error('뉴스 아이템을 찾을 수 없습니다.');

  return result;
}

export const PAGE_SIZE = 10;
export const fetchNewsSlice = async (allNews: NewsItemType[], pageParam: number) => {
  const { length: total_count } = allNews;
  const pageable_count = total_count;
  const startIndex = (pageParam - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageItems = allNews.slice(startIndex, endIndex);

  const response = {
    documents: pageItems,
    meta: {
      is_end: endIndex >= total_count,
      pageable_count,
      total_count
    }
  };

  return Promise.resolve(response);
};

export async function fetchScrapedContent(url: string, description: string) {
  const { data } = await axiosInstance.post<{ content: string; title: string }>('/api/scrape', {
    url,
    description
  });
  return data;
}

export async function fetchSummary({
  content,
  title,
  locale
}: {
  content: string;
  title: string;
  locale: string;
}) {
  const { data } = await axiosInstance.post<{ summary: string }>(
    '/api/summarize',
    {
      content,
      title
    },
    {
      headers: {
        'Accept-Language': locale,
        'Content-Type': 'application/json'
      }
    }
  );
  return data;
}
