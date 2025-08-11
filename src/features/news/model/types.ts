import type { Locale } from '@/shared/config';

export interface NewsItemType {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail?: string;
  source: string;
  sourceEng: string;
  guid: string;
  locale: Locale;
}

export interface NewsMeta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
}

export interface NewsInstance {
  meta: NewsMeta;
  documents: NewsItemType[];
}

export interface SummaryRequestPayload {
  content: string;
  title: string;
  locale: Locale;
}
