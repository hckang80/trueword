'use client';

import { memo } from 'react';

const HomeNewsItemMeta = ({ source }: { source: string }) => (
  <div className='flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400'>
    <span>{source}</span>
  </div>
);
HomeNewsItemMeta.displayName = 'HomeNewsItemMeta';

export default memo(HomeNewsItemMeta);
