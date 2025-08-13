import { useLocalStorage } from '@uidotdev/usehooks';

export * from './use-query';

export function useVisited() {
  const [news] = useLocalStorage<string[]>('visitedNews', []);
  const isVisited = (reference: string) => {
    return news.includes(reference);
  };

  return {
    isVisited
  };
}
