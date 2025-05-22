import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { VIDEO_LENGTH } from '@/features/news';
import { Redis } from '@upstash/redis';

interface VideoItem {
  kind: string;
  etag: string;
  id: VideoId;
  snippet: VideoSnippet;
}

interface VideoId {
  kind: string;
  videoId: string;
}

interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: VideoThumbnail[];
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

interface VideoThumbnail {
  default: { url: string; width: number; height: number };
  medium: { url: string; width: number; height: number };
  high: { url: string; width: number; height: number };
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const CACHE_TTL = 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ message: 'Query is required' }, { status: 400 });
  }

  const key = `video:${query}`;
  const cached = await redis.get<VideoItem[]>(key);

  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const { data } = await axios.get<{ items: VideoItem[] }>(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          key: process.env.YOUTUBE_DATA_API_KEY,
          q: query,
          maxResults: VIDEO_LENGTH,
          type: 'video',
          part: 'snippet',
          videoEmbeddable: true
        }
      }
    );

    const videos = data.items.map(({ id: { videoId: id }, snippet: { title, channelTitle } }) => ({
      id,
      title,
      thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      channelTitle
    }));

    redis.set(key, videos, { ex: CACHE_TTL });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube videos' }, { status: 500 });
  }
}
