import { Suspense } from 'react';
import Container from './_container';
import { BibleInstance, Transition } from '@/@types';
import { fetcher } from '@/utils';
import { QueryClient } from '@tanstack/react-query';

export default async function Bible() {
  const queryClient = new QueryClient();

  const translations = await queryClient.fetchQuery({
    queryKey: ['translations'],
    queryFn: () => fetcher<Record<string, Transition>>(`/translations.json`)
  });

  const koreanBible = Object.values(translations).filter(({ lang }) => lang === 'ko');

  const data = await queryClient.fetchQuery({
    queryKey: ['bible'],
    queryFn: () => fetcher<BibleInstance>(koreanBible[0].url)
  });

  return (
    <div className="min-h-screen p-[20px] font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<div>Loading...</div>}>
        <Container data={data} />
      </Suspense>
    </div>
  );
}
