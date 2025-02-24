import type { Metadata } from 'next';
import Providers from './providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Languages from './locales';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Bible',
  description: 'Bible'
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Common' });

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <header className="flex items-center justify-between p-[20px]">
              <h1>{t('bible')}</h1>
              <Languages />
            </header>
            <main>{children}</main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
