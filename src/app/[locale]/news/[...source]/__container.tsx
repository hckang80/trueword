'use client';

import { buttonVariants } from '@/shared/components/ui/button';
import { Link } from '@/i18n/routing';
import { toReadableDate } from '@/shared';
import { SquareArrowOutUpRight, Undo2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useNewsBySource, useScrapedContent, useSummary } from '@/features/news';
import { useParams } from 'next/navigation';

export default function NewsIdContainer() {
  const { source: sources } = useParams<{ source: string[] }>();
  const { data: news = { link: '', title: '', source: '', pubDate: '' } } =
    useNewsBySource(sources);

  const { link, title, source, pubDate } = news;
  const { data: scraped } = useScrapedContent(link);
  const {
    data: { summary }
  } = useSummary(scraped.content, scraped.title);

  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(summary.replace(/`{3,}/g, '').replace('html', ''))
  });

  return (
    <article className="p-[var(--global-inset)]">
      <NewsHeader title={title} source={source} pubDate={pubDate} />

      <div className="text-gray-700 bg-gray-100 p-[var(--global-inset)]">
        <p className="mb-[10px] text-xs text-muted-foreground">
          이 글은 AI가 원문을 분석하여 핵심 내용을 요약한 것입니다.
        </p>
        <div className="news-summary" dangerouslySetInnerHTML={sanitizedData()} />
      </div>

      <div className="flex justify-center gap-[4px] mt-[20px]">
        <Link href="/news" className={buttonVariants({ variant: 'secondary' })}>
          <Undo2 />
          목록으로
        </Link>
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
  <header className="mb-[10px]">
    <h1 className="text-lg font-bold">{title}</h1>
    <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
      <span>{source}</span>
      <span className="mx-1.5 sm:mx-2">•</span>
      <span>{toReadableDate(new Date(pubDate))}</span>
    </div>
  </header>
);

NewsHeader.displayName = 'NewsHeader';
