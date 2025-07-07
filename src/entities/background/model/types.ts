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
