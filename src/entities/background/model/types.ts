import type { ColorId, ContentFilter, Language, Plus, SearchOrderBy } from 'unsplash-js';
import type { OrientationParam, PaginationParams } from 'unsplash-js/dist/types/request';

export interface BackGroundPhotoInstance {
  results: BackGroundPhoto[];
  total: number;
  total_pages: number;
}

export interface BackGroundPhoto {
  alt_description: string;
  links: {
    download: string;
  };
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
  width: number;
  height: number;
}

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
