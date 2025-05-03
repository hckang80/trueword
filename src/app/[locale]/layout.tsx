import type { Metadata } from 'next';
import Providers from './QueryProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ProgressBar from './ProgressBar';
import { BottomNavigation, isSupportedLocale } from '@/shared';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from './ThemeProvider';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      '성경, 기독교, 말씀, 신앙, 종교 뉴스, Bible, Christian news, Scripture, Faith, Spirituality'
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale) || !routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ProgressBar />
            <Providers>
              <NextIntlClientProvider messages={messages}>
                <Header />
                <main>{children}</main>
                <BottomNavigation />
              </NextIntlClientProvider>
            </Providers>
          </ThemeProvider>
        </ErrorBoundary>
        {process.env.NODE_ENV !== 'development' && <GoogleAnalytics gaId="G-P43JHSZ9K8" />}
      </body>
    </html>
  );
}
