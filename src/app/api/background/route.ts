import { type NextRequest, NextResponse } from 'next/server';
import {
  type ColorId,
  type ContentFilter,
  createApi,
  type Language,
  type Plus,
  type SearchOrderBy
} from 'unsplash-js';
import { PaginationParams, OrientationParam } from 'unsplash-js/dist/types/request';

export type PhotoParams = {
  query: string;
} & Pick<PaginationParams, 'page' | 'perPage'> &
  OrientationParam & {
    orderBy?: SearchOrderBy;
    color?: ColorId;
    plus?: Plus;
    lang?: Language;
    contentFilter?: ContentFilter;
    collectionIds?: string[];
  };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = Object.fromEntries(searchParams.entries()) as unknown as PhotoParams;
  const unsplash = createApi({
    accessKey: 'UFaLEISFs___smayNMm-ithLhO-LwYBMv-vpYTOXeDQ'
  });

  try {
    const { response } = await unsplash.search.getPhotos(params);
    return NextResponse.json(response);
  } catch (error) {
    console.error('error occurred: ', error);
    return NextResponse.json({ error: 'Failed to fetch background' }, { status: 500 });
  }
}
