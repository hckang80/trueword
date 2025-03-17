import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from '../news/__container';
import { fetchNews } from '@/features/news';

export default async function NewsPage() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ['news'],
    queryFn: fetchNews
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
}
