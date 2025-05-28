import type { Metadata } from 'next';
import Providers from './QueryProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/i18n/routing';
import { BottomNavigation, Header, isSupportedLocale, ProgressBar } from '@/shared';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from './ThemeProvider';
import ErrorBoundary from './ErrorBoundary';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      '성경, Bible, 성경앱, Bible App, 기독교, Christianity, 말씀, Scripture, 말씀묵상, Bible Devotion, 큐티, Quiet Time, 성경읽기, Bible Reading, 성경검색, Bible Search, 성경요약, Bible Summary, 성경순, Canonical Order, 예수, Jesus, 신앙, Faith, 경건생활, Devotional, 온라인 성경, Online Bible, 개역개정, KRV, NIV, ESV, 말씀카드, Verse Card, 추천말씀, Daily Verse, 크리스천 뉴스, Christian News, 복음, Gospel, 믿음, Belief, 하나님의 말씀, Word of God'
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
            <ProgressBar color="var(--color-foreground)" showSpinner={false} />
            <Providers>
              <NextIntlClientProvider messages={messages}>
                <Header />
                <main className="guide-line-layout">{children}</main>
                <BottomNavigation />
              </NextIntlClientProvider>
            </Providers>
          </ThemeProvider>
        </ErrorBoundary>
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId="G-P43JHSZ9K8" />}
      </body>
    </html>
  );
}
