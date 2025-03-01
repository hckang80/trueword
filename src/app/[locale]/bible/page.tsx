import { Suspense } from 'react';
import Container from './_container';
import { BibleInstance, Transition } from '@/@types';
import { QueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { bibleKeys, translationsKeys } from '@/lib/queries';

export default async function Bible({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bibleLanguage?: string }>;
}) {
  const { locale: userLocale } = await params;

  const queryClient = new QueryClient();

  const { bibleLanguage = '' } = await searchParams;

  const translations = await queryClient.fetchQuery({
    queryKey: translationsKeys._def,
    queryFn: () => fetcher<Record<string, Transition>>(`/translations.json`)
  });

  const validTranslations = Object.values(translations).filter(
    ({ distribution_license, distribution_versification }) => {
      const conditions = {
        license: ['Public Domain', 'Copyrighted; Free non-commercial distribution'].includes(
          distribution_license
        ),
        versification: !!distribution_versification
      };

      return Object.values(conditions).every(Boolean);
    }
  );

  const [defaultTranslation] = validTranslations.filter(
    ({ lang }) => lang === (bibleLanguage || userLocale)
  );

  const bible = await queryClient.fetchQuery({
    queryKey: bibleKeys._def,
    queryFn: () => fetcher<BibleInstance>(defaultTranslation.url)
  });

  return (
    <div className="min-h-screen p-[20px] font-[family-name:var(--font-geist-sans)]">
      <Suspense
        fallback={
          <div className="text-center">
            <LoaderCircle className="animate-spin" />
          </div>
        }
      >
        <Container translations={validTranslations} data={bible} />
      </Suspense>
    </div>
  );
}
