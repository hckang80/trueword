import type { Metadata } from 'next';
import Providers from './QueryProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/i18n/routing';
import {
  BottomNavigation,
  Header,
  isSupportedLocale,
  ProgressBar,
  type RouteProps
} from '@/shared';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from './ThemeProvider';
import ErrorBoundary from './ErrorBoundary';

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const t = await getTranslations('Meta');
  const { locale } = await params;

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      '성경, Bible, 성경앱, Bible App, 기독교, Christianity, 말씀, Scripture, 말씀묵상, Bible Devotion, 큐티, Quiet Time, 성경읽기, Bible Reading, 성경검색, Bible Search, 성경요약, Bible Summary, 성경순, Canonical Order, 예수, Jesus, 신앙, Faith, 경건생활, Devotional, 온라인 성경, Online Bible, 개역개정, KRV, NIV, ESV, 말씀카드, Verse Card, 추천말씀, Daily Verse, 크리스천 뉴스, Christian News, 복음, Gospel, 믿음, Belief, 하나님의 말씀, Word of God',
    applicationName: t('title'),
    formatDetection: {
      telephone: false
    },
    themeColor: '#000000',
    manifest: '/manifest.json',

    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('title')
    },

    icons: {
      icon: '/favicon.ico',
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/icons/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/icons/favicon-16x16.png'
        },
        {
          rel: 'apple-touch-icon',
          url: '/icons/touch-icon-iphone.png'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '152x152',
          url: '/icons/touch-icon-ipad.png'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/icons/touch-icon-iphone-retina.png'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '167x167',
          url: '/icons/touch-icon-ipad-retina.png'
        },
        {
          rel: 'mask-icon',
          url: '/icons/safari-pinned-tab.svg',
          color: '#5bbad5'
        }
      ]
    },

    twitter: {
      card: 'summary',
      title: t('title'),
      description: t('description'),
      images: 'https://trueword.vercel.app/icons/android-chrome-192x192.png',
      creator: '@Sky'
    },

    openGraph: {
      type: 'website',
      title: t('title'),
      description: t('description'),
      siteName: t('title'),
      url: `https://trueword.vercel.app/${locale}`,
      images: ['https://trueword.vercel.app/icons/apple-touch-icon.png']
    }
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
