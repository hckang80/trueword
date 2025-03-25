'use client';

import type { NewsItem } from '@/entities/news';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function NewsIdContainer({
  summary,
  news: { link }
}: {
  summary: string;
  news: NewsItem;
}) {
  return (
    <article className="p-[var(--global-inset)]">
      <header className="mb-[10px]">
        <h2 className="text-lg font-medium">요약 결과</h2>
        <p>이 글은 AI가 원문을 분석하여 핵심 내용을 요약한 것입니다.</p>
      </header>
      <div className="text-gray-700 whitespace-pre-line bg-gray-100 p-[var(--global-inset)]">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>

      <div className="text-center mt-[20px]">
        <Link className="underline" href={link} target="_blank" rel="noopener noreferrer">
          기사 원문 보기
        </Link>
      </div>
    </article>
  );
}
