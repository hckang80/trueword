'use client';

import { InfiniteScrollTrigger } from '@/shared';
import { InfiniteData } from '@tanstack/react-query';
import { memo } from 'react';
import { NewsInstance } from '../model';
import { NewsItem } from '.';

interface NewsListProps {
  data: InfiniteData<NewsInstance>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const NewsList = ({ data, fetchNextPage, hasNextPage, isFetchingNextPage }: NewsListProps) => (
  <div className="p-[var(--global-inset)]">
    {data.pages.map((page, pageIndex) => (
      <ul key={pageIndex} style={{ display: 'contents' }}>
        {page.documents.map((news) => (
          <NewsItem key={news.guid} item={news} />
        ))}
      </ul>
    ))}
    <InfiniteScrollTrigger
      onIntersect={() => {
        fetchNextPage();
      }}
      enabled={hasNextPage && !isFetchingNextPage}
    />
  </div>
);
NewsList.displayName = 'NewsList';

export default memo(NewsList);
