import { Suspense } from 'react';
import Container from './_container';
import { QueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { bibleKeys, translationsKeys } from '@/shared';
import { BibleProvider } from './Provider';
import { fetchTranslations, fetchTranslationsByLanguage } from '@/features/bible';

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

  const { data: translations } = await queryClient.fetchQuery({
    queryKey: translationsKeys._def,
    queryFn: fetchTranslations
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
    ...bibleKeys.data(defaultTranslation.abbreviation),
    queryFn: () => fetchTranslationsByLanguage(defaultTranslation.abbreviation)
  });

  return (
    <Suspense
      fallback={
        <div className="text-center">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <BibleProvider translations={validTranslations} data={bible}>
        <Container />
      </BibleProvider>
    </Suspense>
  );
}
