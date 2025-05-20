'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { NewsImage, NewsItemMeta } from '.';
import { unstable_ViewTransition as ViewTransition } from 'react';
import type { NewsItemType } from '../model';

const NewsItem = ({ item }: { item: NewsItemType }) => (
  <li>
    <Link
      href={`${usePathname()}/${item.sourceEng}/${item.guid}`}
      className="group flex items-center justify-between gap-[8px] visited:text-purple-600 p-[20px] border border-gray-200 rounded-lg mb-4"
    >
      <ViewTransition name={`news-header-${item.sourceEng}-${item.guid}`}>
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 visited:not:text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
            <strong>{item.title}</strong>
          </h2>
          <NewsItemMeta source={item.source} pubDate={item.pubDate} />
        </div>
        {item.thumbnail && (
          <div className="relative w-[120px] h-[63px] shrink-0 rounded-lg overflow-hidden relative bg-primary/10">
            <NewsImage src={item.thumbnail} alt="" />
          </div>
        )}
      </ViewTransition>
    </Link>
  </li>
);
NewsItem.displayName = 'NewsItem';

export default memo(NewsItem);
