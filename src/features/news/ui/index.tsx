'use client';

import Image from 'next/image';
import { memo } from 'react';

export const NewsImage = memo(({ src }: { src: string }) => (
  <Image src={src} alt="" priority fill style={{ objectFit: 'cover' }} />
));
NewsImage.displayName = 'NewsImage';
