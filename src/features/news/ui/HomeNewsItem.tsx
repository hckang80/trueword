'use client';

import { Link } from '@/shared/i18n/routing';
import { useLocalStorage } from '@uidotdev/usehooks';
import { memo, unstable_ViewTransition as ViewTransition } from 'react';
import { NewsImage } from '.';
import type { NewsItemType } from '../model';

const HomeNewsItem = ({ item }: { item: NewsItemType }) => {
  const [_news, saveNews] = useLocalStorage<string[]>('visitedNews', []);

  return (
    <li>
      <Link
        href={`/news/${item.sourceEng}/${item.guid}`}
        onClick={() => saveNews((prev) => [...prev, `${item.sourceEng}/${item.guid}`])}
        className="group flex flex-col gap-2 visited:text-gray-300 dark:visited:text-gray-600 rounded-lg"
      >
        <ViewTransition name={`news-header-${item.sourceEng}-${item.guid}`}>
          {item.thumbnail && (
            <div className="relative aspect-video basis-[120px] shrink-0 rounded-lg overflow-hidden bg-primary/10">
              <NewsImage src={item.thumbnail} alt="" />
            </div>
          )}
          <p className="text-sm visited:not:text-gray-900 dark:visited:not:text-white group-hover:underline line-clamp-2 break-words">
            {item.title}
          </p>
        </ViewTransition>
      </Link>
    </li>
  );
};
HomeNewsItem.displayName = 'HomeNewsItem';

export default memo(HomeNewsItem);
