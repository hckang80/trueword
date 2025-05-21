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
  // 실제 앱에서는 YouTube API와 연동하는 API 엔드포인트를 호출해야 합니다
  // 데모 목적으로 가상 데이터를 반환합니다
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
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const t = useTranslations('Bible');

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['youtubeVideos', '창세기'],
    queryFn: () => fetchYouTubeVideos('창세기'),
    enabled: open // 모달이 열릴 때만 데이터 가져오기
  });

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

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
          <div className="grid gap-4 py-4 px-4">
            {selectedVideoId ? (
              <div className="mb-4">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                    title="YouTube video player"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <Button variant="outline" className="mt-2" onClick={() => setSelectedVideoId(null)}>
                  목록으로 돌아가기
                </Button>
              </div>
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-4 items-start cursor-pointer"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="flex-shrink-0 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-24 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-10 transition-opacity">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium hover:underline">{video.title}</span>
                    <span className="text-sm text-gray-500">{video.channelTitle}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default VideoPlay;
