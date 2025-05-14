export interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentEncoded?: string;
  creator?: string;
  categories?: string[];
  description?: string;
  guid?: string;
  media?: Array<{
    url: string;
    type: string;
    height?: string;
    width?: string;
  }>;
  thumbnail?: Array<{
    $?: { url: string };
    url?: string;
  }>;
  enclosure?: {
    url: string;
    type: string;
    length?: string;
  };
  'content:encoded'?: string;
  fullContent?: string;
  'itunes:image'?: {
    $?: { href: string };
    href?: string;
  };
  postId: string;
  [key: string]: unknown;
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
  lastBuildDate?: string;
  pubDate?: string;
  language?: string;
  image?: {
    url?: string;
    title?: string;
    link?: string;
  };
  [key: string]: unknown;
}

export interface NewsItem {
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
  documents: NewsItem[];
}
