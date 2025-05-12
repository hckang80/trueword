import { axiosInstance, toReadableDate } from '@/shared';
import type { NewsItem } from '@/features/news';

export * from './fetchRssFeed';

export async function fetchNews(locale: string): Promise<NewsItem[]> {
  const { data } = await axiosInstance<NewsItem[]>('/api/news');

  return data.map((item) => ({ ...item, pubDate: toReadableDate(new Date(item.pubDate), locale) }));
}

export const PAGE_SIZE = 10;
export const fetchNewsSlice = async (allNews: NewsItem[], pageParam: number) => {
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

export async function fetchScrapedContent(url: string) {
  const { data } = await axiosInstance.post<{ content: string; title: string }>('/api/scrape', {
    url
  });
  return data;
}

export async function fetchSummary({ content, title }: { content: string; title: string }) {
  const { data } = await axiosInstance.post<{ summary: string }>('/api/summarize', {
    content,
    title
  });
  return data;
}
