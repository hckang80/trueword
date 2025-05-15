'use client';

import Image from 'next/image';
import { memo } from 'react';

const NewsImage = ({ src }: { src: string }) => (
  <Image src={src} alt="" priority fill style={{ objectFit: 'cover' }} />
);
NewsImage.displayName = 'NewsImage';

export default memo(NewsImage);
