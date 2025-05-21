'use client';

import { useState } from 'react';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { Video } from 'lucide-react';
import { useTranslations } from 'next-intl';

type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
};

async function fetchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  // In a real app, you would call your API endpoint that interfaces with YouTube API
  // For demo purposes, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'dQw4w9WgXcQ',
          title: '창세기 1장 해설 - 태초에',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channelTitle: '성경 채널'
        },
        {
          id: 'UxxajLWwzqY',
          title: '창세기 개요 - 성경의 시작',
          thumbnail: 'https://i.ytimg.com/vi/UxxajLWwzqY/mqdefault.jpg',
          channelTitle: '말씀 연구소'
        },
        {
          id: 'OPf0YbXqDm0',
          title: '창세기 강해 1부 - 아담과 하와',
          thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg',
          channelTitle: '성경 이해하기'
        }
      ]);
    }, 500);
  });
}

function VideoPlay() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Bible');

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['youtubeVideos', '창세기'],
    queryFn: () => fetchYouTubeVideos('창세기'),
    enabled: open // Only fetch when modal is open
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Video className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>{t('videoResults', { defaultValue: '창세기 관련 영상' })}</DrawerTitle>
        </DrawerHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {videos.map((video) => (
              <div key={video.id} className="flex gap-4 items-start">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-32 h-24 object-cover rounded-md"
                  />
                </a>
                <div className="flex flex-col">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {video.title}
                  </a>
                  <span className="text-sm text-gray-500">{video.channelTitle}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default VideoPlay;
