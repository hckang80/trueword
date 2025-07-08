import { axiosInstance } from '@/shared';
import type { BackGroundPhotoInstance, PhotoParams } from '..';

export async function fetchBackgroundPhoto(params: PhotoParams) {
  const { data } = await axiosInstance.get<BackGroundPhotoInstance>('/api/background', {
    params
  });
  return data;
}
