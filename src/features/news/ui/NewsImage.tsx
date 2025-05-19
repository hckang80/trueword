'use client';

import Image, { ImageProps } from 'next/image';
import { memo } from 'react';

const NewsImage = ({ ...props }: ImageProps) => (
  <Image priority fill {...props} style={{ objectFit: 'cover' }} />
);
NewsImage.displayName = 'NewsImage';

export default memo(NewsImage);
