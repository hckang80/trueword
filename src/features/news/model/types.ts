export interface NewsItemType {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail?: string;
  source: string;
  sourceEng: string;
  guid: string;
  locale: string;
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
