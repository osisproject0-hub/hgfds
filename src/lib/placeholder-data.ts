import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback image
    return {
      id: 'fallback',
      description: 'Fallback image',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
      imageHint: 'placeholder',
    };
  }
  return image;
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/programs', label: 'Program' },
  { href: '/news', label: 'Berita' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/admissions', label: 'Penerimaan' },
  { href: '/contact', label: 'Kontak' },
];

export const testimonials = [
  {
    quote: 'This school provided me with the practical skills I needed to succeed in my career. The teachers are fantastic!',
    name: 'Ahmad Subarjo',
    title: 'Alumnus, Mechanical Engineer',
    image: findImage('testimonial-1'),
  },
  {
    quote: 'As a parent, I am so impressed with the quality of education and the supportive environment at this school.',
    name: 'Siti Aminah',
    title: 'Parent',
    image: findImage('testimonial-2'),
  },
  {
    quote: 'The multimedia program was top-notch. I felt well-prepared for the industry from day one.',
    name: 'Budi Santoso',
    title: 'Alumnus, Graphic Designer',
    image: findImage('testimonial-3'),
  },
];
