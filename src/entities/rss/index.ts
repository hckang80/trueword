type RemotePattern = {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
  search?: string;
};

export const RSS_FEEDS = [
  {
    url: 'https://www.christianitytoday.com/rss',
    name: {
      ko: 'christianitytoday',
      en: 'christianitytoday'
    },
    locale: 'en'
  }
  // {
  //   url: 'https://www.christiantoday.co.kr/rss',
  //   name: {
  //     ko: '크리스천투데이',
  //     en: 'christiantoday'
  //   },
  //   locale: 'ko'
  // },
  // {
  //   url: 'https://www.christiandaily.co.kr/rss',
  //   name: {
  //     ko: '기독일보',
  //     en: 'christiandaily'
  //   },
  //   locale: 'ko'
  // },
  // {
  //   url: 'https://kcnp.com/rss',
  //   name: {
  //     ko: '한국기독신문',
  //     en: 'kcnp'
  //   },
  //   locale: 'ko'
  // }
];

export const remotePatterns: RemotePattern[] = RSS_FEEDS.map(({ url }) => {
  const { protocol: fullProtocol, hostname } = new URL(url);
  const protocol = fullProtocol.replace(':', '');

  return {
    ...(_isProtocol(protocol) && { protocol }),
    hostname
  };
});

function _isProtocol(protocol: string): protocol is 'http' | 'https' {
  return ['http', 'https'].includes(protocol.replace(':', ''));
}
