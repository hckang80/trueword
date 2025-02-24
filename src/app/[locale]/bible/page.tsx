import { Suspense } from 'react';
import Container from './_container';
import { BibleInstance, Transition } from '@/@types';
import { QueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/utils';

export default async function Bible({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: userLocale } = await params;

  const queryClient = new QueryClient();

  const translations = await queryClient.fetchQuery({
    queryKey: ['translations'],
    queryFn: () => fetcher<Record<string, Transition>>(`/translations.json`)
  });

  const translationsByLanguage = Object.values(translations).filter(
    ({ lang }) => lang === userLocale
  );

  const data = await queryClient.fetchQuery({
    queryKey: ['bible'],
    queryFn: () => fetcher<BibleInstance>(translationsByLanguage[0].url)
  });

  return (
    <div className="min-h-screen p-[20px] font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<div>Loading...</div>}>
        <Container translations={translationsByLanguage} data={data} />
      </Suspense>
    </div>
  );
}
