'use client';

import { memo } from 'react';

const NewsItemMeta = ({ source, pubDate }: { source: string; pubDate: string }) => (
  <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
    <span>{source}</span>
    <span className="mx-1.5 sm:mx-2">•</span>
    <span>{pubDate}</span>
  </div>
);
NewsItemMeta.displayName = 'NewsItemMeta';

export default memo(NewsItemMeta);
