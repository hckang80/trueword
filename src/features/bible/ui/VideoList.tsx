'use client';

import { useState } from 'react';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Skeleton
} from '@/shared';
import { Video } from 'lucide-react';
import { useYouTubeVideos } from '../hooks';
import Image from 'next/image';
import { VIDEO_LENGTH } from '@/features/news';
import { useTranslations } from 'next-intl';

function VideoList({ chapterName }: { chapterName: string }) {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useYouTubeVideos(chapterName, { enabled: open });

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
      <DrawerContent className="sm:max-w-[600px]" aria-describedby="관련 영상 목록">
        <DrawerHeader>
          <DrawerTitle>{chapterName}</DrawerTitle>
        </DrawerHeader>
        {isLoading ? (
          <div className="grid gap-4 py-4 px-4">
            {Array.from({ length: VIDEO_LENGTH }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 relative">
                  <Skeleton className="w-[128px] h-[72px] rounded-md" />
                </div>
                <div className="flex flex-col grow-1 gap-1">
                  <Skeleton className="w-full h-6" />
                  <Skeleton className="w-30 h-4" />
                </div>
              </div>
            ))}
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
                  {t('BackToList')}
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
                    <Image
                      src={video.thumbnail}
                      width="128"
                      height="72"
                      alt={video.title}
                      className="rounded-md"
                    />
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

export default VideoList;
