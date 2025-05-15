'use client';

import { NewsList, useInfiniteNews, useNews } from '@/features/news';
import { memo } from 'react';
import { useBibleParams } from '@/features/bible';

const NewsItemMeta = memo(({ source, pubDate }: { source: string; pubDate: string }) => (
  <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
    <span>{source}</span>
    <span className="mx-1.5 sm:mx-2">•</span>
    <span>{pubDate}</span>
  </div>
));
NewsItemMeta.displayName = 'NewsItemMeta';

export default function NewsContainer() {
  const { locale } = useBibleParams();
  const { data: news } = useNews(locale);
  const infiniteQuery = useInfiniteNews(news);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery;

  return (
    <NewsList
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
