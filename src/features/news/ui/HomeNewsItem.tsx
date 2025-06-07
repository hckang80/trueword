'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { NewsImage, HomeNewsItemMeta } from '.';
import { unstable_ViewTransition as ViewTransition } from 'react';
import type { NewsItemType } from '../model';

const HomeNewsItem = ({ item }: { item: NewsItemType }) => (
  <li>
    <Link
      href={`${usePathname()}/news/${item.sourceEng}/${item.guid}`}
      className="group flex flex-col gap-2 visited:text-gray-300 dark:visited:text-gray-600 rounded-lg"
    >
      <ViewTransition name={`news-header-${item.sourceEng}-${item.guid}`}>
        {item.thumbnail && (
          <div className="relative aspect-video basis-[120px] shrink-0 rounded-lg overflow-hidden bg-primary/10">
            <NewsImage src={item.thumbnail} alt="" />
          </div>
        )}
        <div>
          <h2 className="text-sm mb-1 visited:not:text-gray-900 dark:visited:not:text-white group-hover:underline transition-colors duration-300 line-clamp-2 break-words">
            {item.title}
          </h2>
          <HomeNewsItemMeta source={item.source} />
        </div>
      </ViewTransition>
    </Link>
  </li>
);
HomeNewsItem.displayName = 'HomeNewsItem';

export default memo(HomeNewsItem);
