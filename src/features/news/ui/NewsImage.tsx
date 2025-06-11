'use client';

import Image, { ImageProps } from 'next/image';
import { memo } from 'react';

const NewsImage = ({ alt = '', ...props }: ImageProps) => (
  <Image
    priority
    sizes="(max-width: 440px) 100vw, 440px"
    fill
    alt={alt}
    {...props}
    className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
    style={{ objectFit: 'cover' }}
  />
);
NewsImage.displayName = 'NewsImage';

export default memo(NewsImage);
