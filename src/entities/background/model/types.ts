import type { SearchOrderBy, ColorId, Plus, Language, ContentFilter } from 'unsplash-js';
import type { PaginationParams, OrientationParam } from 'unsplash-js/dist/types/request';

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
  };
  width: number;
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
