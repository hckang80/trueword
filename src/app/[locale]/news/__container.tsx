'use client';

import {
  useInfiniteNews,
  useNews,
  type NewsInstance,
  type NewsItem as TNewsItem
} from '@/features/news';
import { InfiniteScrollTrigger } from '@/shared';
import Image from 'next/image';
import { memo } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { unstable_ViewTransition as ViewTransition } from 'react';
import type { InfiniteData } from '@tanstack/react-query';

const NewsLoading = () => <div className="text-center py-10">뉴스를 불러오는 중입니다...</div>;

const NewsError = () => (
  <div className="text-center py-10 text-red-500">뉴스를 불러오는 데 실패했습니다.</div>
);

const NewsImage = memo(({ src }: { src: string | null }) => (
  <div className="w-[120px] shrink-0 rounded-lg overflow-hidden relative bg-primary/10">
    <Image
      src={src || '/blank.png'}
      width={120}
      height={63}
      style={{ aspectRatio: '2/1.05' }}
      alt=""
      unoptimized
      priority
    />
  </div>
));
NewsImage.displayName = 'NewsImage';

const NewsItemMeta = memo(({ source, pubDate }: { source: string; pubDate: string }) => (
  <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
    <span>{source}</span>
    <span className="mx-1.5 sm:mx-2">•</span>
    <span>{pubDate}</span>
  </div>
));
NewsItemMeta.displayName = 'NewsItemMeta';

const NewsItem = memo(({ item }: { item: TNewsItem }) => (
  <article>
    <Link
      href={`${usePathname()}/${item.sourceEng}/${item.guid}`}
      className="group flex items-center justify-between gap-[8px] visited:text-purple-600 p-[20px] border border-gray-200 rounded-lg mb-4"
    >
      <ViewTransition name={`title-${item.sourceEng}-${item.guid}`}>
        <div>
          <h1 className="text-sm sm:text-base md:text-lg font-semibold mb-2 visited:not:text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
            <strong>{item.title}</strong>
          </h1>
          {item.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs sm:text-sm">
              {item.description}
            </p>
          )}
          <NewsItemMeta source={item.source} pubDate={item.pubDate} />
        </div>
      </ViewTransition>
      <ViewTransition name={`thumbnail-${item.sourceEng}-${item.guid}`}>
        <NewsImage src={item.thumbnail || '/blank.png'} />
      </ViewTransition>
    </Link>
  </article>
));
NewsItem.displayName = 'NewsItem';

interface NewsListProps {
  data?: InfiniteData<NewsInstance>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}
const NewsList = memo(({ data, fetchNextPage, hasNextPage, isFetchingNextPage }: NewsListProps) => (
  <div className="p-[var(--global-inset)]">
    {data?.pages.map((page, pageIndex) => (
      <div key={pageIndex} style={{ display: 'contents' }}>
        {/* {page.documents.map((news) => (
          <NewsItem key={news.guid} item={news} />
        ))} */}
      </div>
    ))}
    <InfiniteScrollTrigger
      onIntersect={() => {
        fetchNextPage();
      }}
      enabled={hasNextPage && !isFetchingNextPage}
    />
  </div>
));
NewsList.displayName = 'NewsList';

export default function NewsContainer() {
  console.time('useNews');
  const { data: news = [], isLoading, isError } = useNews();
  console.timeEnd('useNews');
  console.time('useInfiniteNews');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteNews(news);
  console.timeEnd('useInfiniteNews');

  if (isLoading) return <NewsLoading />;
  if (isError) return <NewsError />;

  return <div>NEWS</div>;
}
