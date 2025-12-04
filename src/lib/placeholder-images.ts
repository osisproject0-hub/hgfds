
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// The type assertion is needed because the JSON file can now be empty.
export const PlaceHolderImages: ImagePlaceholder[] = (data as any).placeholderImages || [];
