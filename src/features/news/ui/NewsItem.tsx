'use client';

import { Card, CardContent } from '@/shared/components';
import { useLocalStorage } from '@uidotdev/usehooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, unstable_ViewTransition as ViewTransition } from 'react';
import { NewsImage, NewsItemMeta } from '.';
import type { NewsItemType } from '../model';

const NewsItem = ({ item }: { item: NewsItemType }) => {
  const [_news, saveNews] = useLocalStorage<string[]>('visitedNews', []);
  return (
    <li>
      <Card>
        <CardContent>
          <Link
            href={`${usePathname()}/${item.sourceEng}/${item.guid}`}
            onClick={() => saveNews((prev) => [...prev, `${item.sourceEng}/${item.guid}`])}
            className="group flex items-center justify-between gap-2 visited:text-gray-300 dark:visited:text-gray-600"
          >
            <ViewTransition name={`news-header-${item.sourceEng}-${item.guid}`}>
              <div>
                <h2 className="font-semibold mb-2 visited:not:text-gray-900 dark:visited:not:text-white group-hover:underline">
                  <strong>{item.title}</strong>
                </h2>
                <NewsItemMeta source={item.source} pubDate={item.pubDate} />
              </div>
              {item.thumbnail && (
                <div className="relative aspect-video basis-[120px] shrink-0 rounded-lg overflow-hidden bg-primary/10">
                  <NewsImage src={item.thumbnail} alt="" />
                </div>
              )}
            </ViewTransition>
          </Link>
        </CardContent>
      </Card>
    </li>
  );
};
NewsItem.displayName = 'NewsItem';

export default memo(NewsItem);
