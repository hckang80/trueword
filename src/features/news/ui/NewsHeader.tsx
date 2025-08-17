'use client';

const NewsHeader = ({
  title,
  source,
  pubDate
}: {
  title: string;
  source: string;
  pubDate: string;
}) => (
  <header className='mb-[10px] inline-block'>
    <h1 className='text-lg font-bold'>{title}</h1>
    <div className='flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400'>
      <span>{source}</span>
      <span className='mx-1.5 sm:mx-2'>•</span>
      <span>{pubDate}</span>
    </div>
  </header>
);

export default NewsHeader;
