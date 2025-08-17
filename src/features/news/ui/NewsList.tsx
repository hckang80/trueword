'use client';

import { InfiniteScrollTrigger } from '@/shared/components';
import type { InfiniteData, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { memo } from 'react';
import { NewsItem } from '.';
import type { NewsInstance } from '../model';

type NewsListProps = UseSuspenseInfiniteQueryResult<InfiniteData<NewsInstance, unknown>, Error>;

const NewsList = ({ data, fetchNextPage, hasNextPage, isFetchingNextPage }: NewsListProps) => (
  <div className='grid gap-4'>
    {data.pages.map((page, pageIndex) => (
      <ul key={pageIndex} style={{ display: 'contents' }}>
        {page.documents.map(news => (
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
