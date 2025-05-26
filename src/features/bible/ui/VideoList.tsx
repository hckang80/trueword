'use client';

import { useState } from 'react';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  Skeleton
} from '@/shared';
import { Video } from 'lucide-react';
import Image from 'next/image';
import { VIDEO_LENGTH } from '@/features/news';
import { useTranslations } from 'next-intl';
import { type YouTubeVideo, useYouTubeVideos } from '..';

function VideoList({ chapterName }: { chapterName: string }) {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const { data: videos = [], isLoading } = useYouTubeVideos(chapterName, { enabled: open });

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Video />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="h-[432px]">
          <DrawerTitle hidden>{chapterName}</DrawerTitle>
          <DrawerDescription asChild>
            <div className="grid gap-[10px]">
              {isLoading ? (
                Array.from({ length: VIDEO_LENGTH }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 relative">
                      <Skeleton className="w-[128px] h-[72px] rounded-md" />
                    </div>
                    <div className="flex flex-col grow-1 gap-1">
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-30 h-4" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {selectedVideo ? (
                    <>
                      <div className="flex flex-col grow-1 gap-1 text-left">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {selectedVideo.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedVideo.channelTitle}
                        </span>
                      </div>
                      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                          title="YouTube video player"
                          className="absolute top-0 left-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setSelectedVideo(null)}
                      >
                        {t('BackToList')}
                      </Button>
                    </>
                  ) : (
                    videos.map((video) => (
                      <button
                        key={video.id}
                        className="flex gap-4"
                        onClick={() => handleVideoClick(video)}
                      >
                        <div className="shrink-0 relative">
                          <Image
                            src={video.thumbnail}
                            width="128"
                            height="72"
                            alt={video.title}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex flex-col grow-1 gap-1 text-left">
                          <span className="text-sm text-gray-900 dark:text-white hover:underline">
                            {video.title}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {video.channelTitle}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </>
              )}
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default VideoList;
