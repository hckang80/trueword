import { BottomNavigation, Header, isSupportedLocale, ProgressBar, Toaster } from '@/shared';
import { routing } from '@/shared/i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ErrorBoundary from './ErrorBoundary';
import Providers from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      '성경, Bible, 성경앱, Bible App, 기독교, Christianity, 말씀, Scripture, 말씀묵상, Bible Devotion, 큐티, Quiet Time, 성경읽기, Bible Reading, 성경검색, Bible Search, 성경요약, Bible Summary, 성경순, Canonical Order, 예수, Jesus, 신앙, Faith, 경건생활, Devotional, 온라인 성경, Online Bible, 개역개정, KRV, NIV, ESV, 말씀카드, Verse Card, 추천말씀, Daily Verse, 크리스천 뉴스, Christian News, 복음, Gospel, 믿음, Belief, 하나님의 말씀, Word of God',
    applicationName: t('title'),
    formatDetection: {
      telephone: false
    },
    manifest: '/manifest.json',

    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('title')
    },

    icons: {
      other: [
        // iPhone 5/SE (1세대)
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-640-1136.png',
          media:
            '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPhone 6/7/8/SE (2,3세대)
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-750-1334.png',
          media:
            '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPhone 6/7/8 Plus
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1242-2208.png',
          media:
            '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPhone X/XS/11 Pro
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1125-2436.png',
          media:
            '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPhone XR/11
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-828-1792.png',
          media:
            '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPhone XS Max/11 Pro Max
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1242-2688.png',
          media:
            '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPhone 12 mini/13 mini/12/12 Pro/13/13 Pro/14
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1170-2532.png',
          media:
            '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPhone 12 Pro Max/13 Pro Max/14 Plus
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1284-2778.png',
          media:
            '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPhone 14 Pro
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1179-2556.png',
          media:
            '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPhone 14 Pro Max
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1290-2796.png',
          media:
            '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
        },
        // iPad (일반)
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1536-2048.png',
          media:
            '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPad Pro 10.5인치
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1668-2224.png',
          media:
            '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPad Pro 11인치 (1세대 이후)
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-1668-2388.png',
          media:
            '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPad Pro 12.9인치
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-2048-2732.png',
          media:
            '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
        },
        // iPad (일반) 가로 모드
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/apple-splash-2048-1536.png',
          media:
            '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
        }
      ]
    }
  };
}

export function generateViewport() {
  return {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover'
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
      <head>
        {/* TODO: Metadata 설정으로 적용이 안되서 수동으록 추가 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
      </head>
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
                <Theme>
                  <Header />
                  <main className="guide-line-layout">{children}</main>
                  <BottomNavigation />
                  <Toaster position="top-center" />
                </Theme>
              </NextIntlClientProvider>
            </Providers>
          </ThemeProvider>
        </ErrorBoundary>
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId="G-P43JHSZ9K8" />}
      </body>
    </html>
  );
}
