'use client';

import {
  NewsHeader,
  NewsImage,
  useNewsBySource,
  useScrapedContent,
  useSummary
} from '@/features/news';
import { Button, Loading } from '@/shared/components';
import { Link } from '@/shared/i18n/routing';
import { useLocalStorage } from '@uidotdev/usehooks';
import { SquareArrowOutUpRight, Undo2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, unstable_ViewTransition as ViewTransition } from 'react';
import sanitizeHtml from 'sanitize-html';

export default function NewsIdContainer() {
  const t = useTranslations();
  const { locale, source: sources } = useParams<{ locale: string; source: string[] }>();
  const { data: news } = useNewsBySource(sources, locale);
  const [, saveNews] = useLocalStorage<string[]>('visitedNews', []);

  useEffect(() => {
    saveNews((prev) => [...prev, sources.join('/')]);
  }, []);

  if (!news) throw Error(t('News.noNews'));

  const { link, title, description, source, pubDate, thumbnail } = news;
  const {
    data: { content }
  } = useScrapedContent(link, description);
  const { data: summaryData, isLoading, isError } = useSummary({ content, title, locale });
  const { summary = '' } = summaryData || {};

  const sanitizedData = () => ({
    __html: sanitizeHtml(summary.replace(/`{3,}/g, '').replace('html', ''))
  });

  return (
    <article>
      <ViewTransition name={`news-header-${sources[0]}-${sources[1]}`}>
        <NewsHeader title={title} source={source} pubDate={pubDate} />

        {thumbnail && (
          <div className="relative aspect-video">
            <NewsImage src={thumbnail} alt="" />
          </div>
        )}
      </ViewTransition>

      <div className="text-gray-700 bg-[var(--color-secondary)] p-[var(--global-inset)]">
        <div className="flex justify-end gap-1 mb-5">
          <Button size="icon" title={t('Common.back')} onClick={() => history.back()}>
            <Undo2 />
          </Button>
          <Button size="icon" asChild>
            <Link
              title={t('News.viewFullArticle')}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SquareArrowOutUpRight />
            </Link>
          </Button>
        </div>

        {!isError && (
          <p className="mb-[10px] text-xs text-muted-foreground">
            {t(isLoading ? 'News.aiSummaryLoading' : 'News.aiSummary')}
          </p>
        )}

        <div className="news-summary text-secondary-foreground">
          {isLoading && (
            <div className="relative min-h-30">
              <Loading />
            </div>
          )}

          {!isError ? (
            <div dangerouslySetInnerHTML={sanitizedData()} />
          ) : (
            <p className="p-12 text-center">
              {t('News.summarizeError')}{' '}
              <Link
                title={t('News.viewFullArticle')}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {t('News.viewFullArticle')}
              </Link>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
