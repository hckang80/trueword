'use client';

import Image, { ImageProps } from 'next/image';
import { memo } from 'react';

const NewsImage = ({ alt = '', ...props }: ImageProps) => (
  <Image priority fill alt={alt} {...props} style={{ objectFit: 'cover' }} />
);
NewsImage.displayName = 'NewsImage';

export default memo(NewsImage);
