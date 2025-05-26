export type RemotePattern = {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
  search?: string;
};

export interface RSSInstanceItem {
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
  postId?: string;
  [key: string]: unknown;
}

export interface RSSInstance {
  title: string;
  description: string;
  link: string;
  items: RSSInstanceItem[];
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

export type RSSFeed = {
  url: string;
  imageUrl?: string;
  name: RSSFeedName;
  locale: string;
};

export type RSSFeedName = { native?: string; global: string };
