import { type RemotePattern, RSS_FEEDS } from '../model';

export const remotePatterns: RemotePattern[] = RSS_FEEDS.map(({ url, imageUrl }) => {
  const { protocol: fullProtocol, hostname } = new URL(url);
  const protocol = fullProtocol.replace(':', '');

  return {
    ...(_isProtocol(protocol) && { protocol }),
    hostname: imageUrl || hostname
  };
});

function _isProtocol(protocol: string): protocol is 'http' | 'https' {
  return ['http', 'https'].includes(protocol.replace(':', ''));
}
