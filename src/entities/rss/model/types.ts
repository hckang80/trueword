export type RemotePattern = {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
  search?: string;
};

export type RSSFeed = {
  url: string;
  imageUrl?: string;
  name: RSSFeedName;
  locale: string;
};

export type RSSFeedName = Record<string, string> & { en: string };
