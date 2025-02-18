import { Suspense } from 'react';
import Container from './_container';
import { BibleInstance } from '@/@types';

export default async function Home() {
  const data: BibleInstance = await fetch('https://api.getbible.net/v2/korean.json').then((res) =>
    res.json()
  );

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<div>Loading...</div>}>
        <Container data={data} />
      </Suspense>
    </div>
  );
}
