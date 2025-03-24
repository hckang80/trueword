'use client';

import { useNews } from '@/features/news';
import { NewsItem as TNewsItem } from '@/entities/news';
import { toReadableDate } from '@/shared';
import Image from 'next/image';
import { memo } from 'react';
import { Link, usePathname } from '@/i18n/routing';

const NewsLoading = () => <div className="text-center py-10">뉴스를 불러오는 중입니다...</div>;

const NewsError = () => (
  <div className="text-center py-10 text-red-500">뉴스를 불러오는 데 실패했습니다.</div>
);

const NewsImage = memo(({ src }: { src: string | null }) => (
  <div className="w-[120px] shrink-0 rounded-lg overflow-hidden relative bg-primary/10">
    {/* TODO: 최적화 안되는 이미지가 있어서 unoptimized 임시 추가 */}
    <Image
      src={src || '/blank.png'}
      width={120}
      height={63}
      style={{ aspectRatio: '2/1.05' }}
      alt=""
      unoptimized
    />
  </div>
));
NewsImage.displayName = 'NewsImage';

const NewsItemMeta = memo(({ source, pubDate }: { source: string; pubDate: string }) => (
  <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
    <span>{source}</span>
    <span className="mx-1.5 sm:mx-2">•</span>
    <span>{toReadableDate(new Date(pubDate))}</span>
  </div>
));
NewsItemMeta.displayName = 'NewsItemMeta';

const NewsItem = memo(({ item }: { item: TNewsItem }) => (
  <article>
    <Link
      href={`${usePathname()}/${item.sourceEng}/${item.guid}`}
      className="group flex items-center justify-between gap-[8px] visited:text-purple-600 p-[20px] border border-gray-200 rounded-lg mb-4"
    >
      <div>
        <h1 className="text-sm sm:text-base md:text-lg font-semibold mb-2 visited:not:text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
          <strong>{item.title}</strong>
        </h1>
        {item.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs sm:text-sm">
            {item.description}
          </p>
        )}
        <NewsItemMeta source={item.source} pubDate={item.pubDate} />
      </div>
      <NewsImage src={item.thumbnail || '/blank.png'} />
    </Link>
  </article>
));
NewsItem.displayName = 'NewsItem';

const NewsList = memo(({ news }: { news: TNewsItem[] }) => (
  <div className="p-[var(--global-inset)]">
    {news.map((item) => (
      <NewsItem key={item.guid} item={item} />
    ))}
  </div>
));
NewsList.displayName = 'NewsList';

export default function NewsContainer() {
  const { data: news = [], isLoading, isError } = useNews();

  if (isLoading) return <NewsLoading />;
  if (isError) return <NewsError />;

  return <NewsList news={news} />;
}
