import { Suspense } from 'react';
import Container from './_container';
import { BibleInstance } from '@/@types';
import { fetcher } from '@/utils';
import { QueryClient } from '@tanstack/react-query';

export default async function Home() {
  const queryClient = new QueryClient();

  const data = await queryClient.fetchQuery({
    queryKey: ['bible'],
    queryFn: () => fetcher<BibleInstance>(`/korean.json`)
  });

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<div>Loading...</div>}>
        <Container data={data} />
      </Suspense>
    </div>
  );
}
