'use client';

import { Button, buttonVariants } from '@/shared';
import { Link } from '@/shared/i18n/routing';
import { SquareArrowOutUpRight, Undo2 } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import {
  NewsHeader,
  NewsImage,
  useNewsBySource,
  useScrapedContent,
  useSummary
} from '@/features/news';
import { useParams } from 'next/navigation';
import { unstable_ViewTransition as ViewTransition } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsIdContainer() {
  const t = useTranslations();
  const { locale, source: sources } = useParams<{ locale: string; source: string[] }>();
  const { data: news } = useNewsBySource(sources, locale);

  if (!news) throw Error(t('News.noNews'));

  const { link, title, description, source, pubDate, thumbnail = '' } = news;
  const { data: scraped } = useScrapedContent(link, description);
  const {
    data: { summary }
  } = useSummary(scraped.content, scraped.title, locale);

  const sanitizedData = () => ({
    __html: sanitizeHtml(summary.replace(/`{3,}/g, '').replace('html', ''))
  });

  return (
    <article className="p-[var(--global-inset)]">
      <ViewTransition name={`news-header-${sources[0]}-${sources[1]}`}>
        <NewsHeader title={title} source={source} pubDate={pubDate} />

        {thumbnail && (
          <div className="relative aspect-video">
            <NewsImage src={thumbnail} alt="" />
          </div>
        )}
      </ViewTransition>

      <div className="text-gray-700 bg-[var(--color-secondary)] p-[var(--global-inset)]">
        <p className="mb-[10px] text-xs text-muted-foreground">{t('News.aiSummary')}</p>
        <div
          className="news-summary text-secondary-foreground"
          dangerouslySetInnerHTML={sanitizedData()}
        />
      </div>

      <div className="flex justify-center gap-[4px] mt-[20px]">
        <Button variant="secondary" onClick={() => history.back()}>
          <Undo2 />
          {t('Common.back')}
        </Button>
        <Link href={link} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
          <SquareArrowOutUpRight />
          {t('News.viewFullArticle')}
        </Link>
      </div>
    </article>
  );
}
