import type { Metadata } from 'next';
import Providers from './providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <main>{children}</main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
