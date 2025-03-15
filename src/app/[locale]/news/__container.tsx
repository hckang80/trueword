'use client';

import { useNews } from '@/features/news';
import { toReadableDate } from '@/lib/utils';
import Image from 'next/image';

export default function NewsContainer() {
  const { data: news, isLoading, isError } = useNews();

  if (isLoading) return <div className="text-center py-10">뉴스를 불러오는 중입니다...</div>;
  if (isError || !news)
    return <div className="text-center py-10 text-red-500">뉴스를 불러오는 데 실패했습니다.</div>;

  return (
    <div className="p-[20px]">
      {news.map((item) => (
        <article key={item.guid}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-[8px] visited:text-purple-600 p-[20px] border border-gray-200 rounded-lg mb-4"
          >
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-semibold mb-2 visited:not:text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                <strong>{item.title}</strong>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs sm:text-sm">
                {item.description}
              </p>
              <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                <span>{item.source}</span>
                <span className="mx-1.5 sm:mx-2">•</span>
                <span>{toReadableDate(new Date(item.pubDate))}</span>
              </div>
            </div>
            <div className="w-[120px] flex-shrink-0 rounded-lg overflow-hidden relative bg-primary/10">
              {/* TODO: 최적화 안되는 이미지가 있어서 unoptimized 임시 추가 */}
              <Image
                src={item.thumbnail || '/blank.png'}
                width={120}
                height={63}
                style={{ aspectRatio: '2/1.05' }}
                alt=""
                unoptimized
              />
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
