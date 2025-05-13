'use client';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Link } from '@/shared/i18n/routing';
import { SquareArrowOutUpRight, Undo2 } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import { useNewsBySource, useScrapedContent, useSummary } from '@/features/news';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition } from 'react';

export default function NewsIdContainer() {
  const { locale, source: sources } = useParams<{ locale: string; source: string[] }>();
  const {
    data: news = { link: '', title: '', description: '', source: '', pubDate: '', thumbnail: '' }
  } = useNewsBySource(sources, locale);

  const { link, title, description, source, pubDate, thumbnail = '' } = news;
  let originThumbnail = '';
  try {
    const { origin, pathname } = new URL(thumbnail);
    originThumbnail = `${origin}${pathname}`;
  } catch {}
  const { data: scraped } = useScrapedContent(link, description);
  const {
    data: { summary }
  } = useSummary(scraped.content, scraped.title, locale);

  const sanitizedData = () => ({
    __html: sanitizeHtml(summary.replace(/`{3,}/g, '').replace('html', ''))
  });

  return (
    <article className="p-[var(--global-inset)]">
      <ViewTransition name={`title-${sources[0]}-${sources[1]}`}>
        <NewsHeader title={title} source={source} pubDate={pubDate} />
      </ViewTransition>

      {originThumbnail && (
        <ViewTransition name={`thumbnail-${sources[0]}-${sources[1]}`}>
          <div className="relative h-[250px]">
            <Image src={originThumbnail} alt="" priority fill style={{ objectFit: 'cover' }} />
          </div>
        </ViewTransition>
      )}

      <div className="text-gray-700 bg-[var(--color-secondary)] p-[var(--global-inset)]">
        <p className="mb-[10px] text-xs text-muted-foreground">
          이 글은 AI가 원문을 분석하여 핵심 내용을 요약한 것입니다.
        </p>
        <div
          className="news-summary text-secondary-foreground"
          dangerouslySetInnerHTML={sanitizedData()}
        />
      </div>

      <div className="flex justify-center gap-[4px] mt-[20px]">
        <Button variant="secondary" onClick={() => history.back()}>
          <Undo2 />
          이전으로
        </Button>
        <Link href={link} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
          <SquareArrowOutUpRight />
          기사 원문 보기
        </Link>
      </div>
    </article>
  );
}

const NewsHeader = ({
  title,
  source,
  pubDate
}: {
  title: string;
  source: string;
  pubDate: string;
}) => (
  <header className="mb-[10px] inline-block">
    <h1 className="text-lg font-bold">{title}</h1>
    <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
      <span>{source}</span>
      <span className="mx-1.5 sm:mx-2">•</span>
      <span>{pubDate}</span>
    </div>
  </header>
);

NewsHeader.displayName = 'NewsHeader';
