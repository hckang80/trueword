'use client';

import { Link } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib';
import { useLocalStorage } from '@uidotdev/usehooks';
import { memo, unstable_ViewTransition as ViewTransition } from 'react';
import { NewsImage } from '.';
import type { NewsItemType } from '../model';

const HomeNewsItem = ({ item }: { item: NewsItemType }) => {
  const [news, saveNews] = useLocalStorage<string[]>('visitedNews', []);
  const isVisited = (reference: string) => {
    return news.includes(reference);
  };

  return (
    <li>
      <Link
        href={`/news/${item.sourceEng}/${item.guid}`}
        onClick={() => saveNews((prev) => [...prev, `${item.sourceEng}/${item.guid}`])}
        className={cn(
          'group flex flex-col gap-2 rounded-lg',
          isVisited(`${item.sourceEng}/${item.guid}`) && 'text-gray-300 dark:text-gray-600'
        )}
      >
        <ViewTransition name={`news-header-${item.sourceEng}-${item.guid}`}>
          {item.thumbnail && (
            <div className="relative aspect-video basis-[120px] shrink-0 rounded-lg overflow-hidden bg-primary/10">
              <NewsImage src={item.thumbnail} alt="" />
            </div>
          )}
          <p className="text-sm group-hover:underline line-clamp-2 break-words">{item.title}</p>
        </ViewTransition>
      </Link>
    </li>
  );
};
HomeNewsItem.displayName = 'HomeNewsItem';

export default memo(HomeNewsItem);
