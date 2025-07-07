import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchBackgroundPhoto } from '../api';
import type { PhotoParams } from '../model';

export function backgroundPhotoQueryOptions(params: PhotoParams) {
  return {
    queryKey: ['background', params.query],
    queryFn: () => fetchBackgroundPhoto(params),
    staleTime: Infinity
  };
}
export function useBackgroundPhoto(params: PhotoParams) {
  return useSuspenseQuery(backgroundPhotoQueryOptions(params));
}
