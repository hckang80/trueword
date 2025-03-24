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

  'media:thumbnail'?: Array<{
    $?: { url: string };
    url?: string;
  }>;

  enclosure?: {
    url: string;
    type: string;
    length?: string;
  };

  'itunes:image'?: {
    $?: { href: string };
    href?: string;
  };

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
  description?: string;
  pubDate: string;
  thumbnail?: string;
  source: string;
  sourceEng: string;
  guid: string;
}
