import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { VIDEO_LENGTH } from '@/features/news';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

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

    return NextResponse.json(videos);
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube videos' }, { status: 500 });
  }
}
