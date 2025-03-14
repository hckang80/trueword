export interface NewsItem {
  title: string;
  link: string;
  description?: string;
  pubDate: string;
  thumbnail?: string;
  source: string;
  guid: string;
}

export interface RssFeedItem {
  title: string;
  link: string;
  id?: string;
  guid?: string;
  published: string;
  description?: string;
  content?: string;
  enclosures?: Array<{
    url: string;
    type?: string;
    length?: number;
  }>;
  media?: {
    thumbnail?: {
      url: string;
    };
  };
  [key: string]: unknown;
}

export interface RssFeed {
  title: string;
  description?: string;
  link?: string;
  items: RssFeedItem[];
}
