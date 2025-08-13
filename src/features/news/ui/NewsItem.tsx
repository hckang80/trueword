'use client';

import { Card, CardContent } from '@/shared/components';
import { cn } from '@/shared/lib';
import { useLocalStorage } from '@uidotdev/usehooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, unstable_ViewTransition as ViewTransition } from 'react';
import { NewsImage, NewsItemMeta } from '.';
import type { NewsItemType } from '../model';

const NewsItem = ({ item }: { item: NewsItemType }) => {
  const [news] = useLocalStorage<string[]>('visitedNews', []);
  const isVisited = (reference: string) => {
    return news.includes(reference);
  };

  return (
    <li>
      <Card>
        <CardContent>
          <Link
            href={`${usePathname()}/${item.sourceEng}/${item.guid}`}
            className={cn(
              'group flex items-center justify-between gap-2',
              isVisited(`${item.sourceEng}/${item.guid}`) && 'text-gray-300 dark:text-gray-600'
            )}
          >
            <ViewTransition name={`news-header-${item.sourceEng}-${item.guid}`}>
              <div>
                <h2 className="font-semibold mb-2 group-hover:underline">
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
