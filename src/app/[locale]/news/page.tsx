'use client';

import { useNews } from '@/app/features/news/hooks';

export default function News() {
  const { data: news, isLoading, isError } = useNews();

  if (isLoading) return <div className="text-center py-10">뉴스를 불러오는 중입니다...</div>;
  if (isError)
    return <div className="text-center py-10 text-red-500">뉴스를 불러오는 데 실패했습니다.</div>;

  return <pre className="whitespace-pre-wrap p-[20px]">{JSON.stringify(news, null, 2)}</pre>;
}
