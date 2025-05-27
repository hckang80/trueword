import Container from './__container';

// type Props = { params: Promise<{ locale: string; source: string[] }> };

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const previousTitle = (await parent).title;

//   const { locale, source: sources } = await params;

//   const queryClient = new QueryClient();

//   const news = await queryClient.fetchQuery(newsQueryOptions(locale));
//   const newsBySource = getNewsItem(news, sources);

//   return {
//     title: `${newsBySource?.title} - ${previousTitle?.absolute}`
//   };
// } 무한 루프로 임시 제거

export default async function NewsIdPage() {
  return <Container />;
}
