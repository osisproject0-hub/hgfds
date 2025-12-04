
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Wrench,
  Calculator,
  Camera,
  LineChart,
  GraduationCap,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

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

export const featuredPrograms = [
  {
    icon: Wrench,
    title: 'Teknik Mesin',
    description: 'Learn to design, manufacture, and maintain machinery with cutting-edge technology.',
    image: findImage('program-mesin'),
  },
  {
    icon: Calculator,
    title: 'Akuntansi',
    description: 'Master financial principles, bookkeeping, and business accounting standards.',
    image: findImage('program-akuntansi'),
  },
  {
    icon: Camera,
    title: 'Multimedia',
    description: 'Unleash your creativity in graphic design, video production, and web development.',
    image: findImage('program-multimedia'),
  },
  {
    icon: LineChart,
    title: 'Pemasaran',
    description: 'Develop skills in digital marketing, sales strategies, and market analysis.',
    image: findImage('program-pemasaran'),
  },
];

export const schoolStats = [
  { value: 1200, label: 'Students', icon: GraduationCap },
  { value: 50, label: 'Expert Teachers', icon: Users },
  { value: 95, label: 'Graduation Rate (%)', icon: Award },
  { value: 4, label: 'Vocational Programs', icon: BookOpen },
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

export const newsAndEvents = [
  {
    category: 'Competition',
    title: 'Students Win National Robotics Competition',
    date: '2024-07-15',
    image: findImage('news-1'),
  },
  {
    category: 'Announcement',
    title: 'New Semester Enrollment is Now Open',
    date: '2024-07-10',
    image: findImage('news-2'),
  },
  {
    category: 'Event',
    title: 'Annual School Fest and Open House',
    date: '2024-07-05',
    image: findImage('news-3'),
  },
]

export const adminOverviewData = [
    { title: "Total Students", value: "1,200", change: "+5%", icon: Users },
    { title: "New Applications", value: "85", change: "+12", icon: GraduationCap },
    { title: "Website Visits", value: "12,450", change: "+8%", icon: LineChart },
    { title: "Unread Messages", value: "12", change: "+3", icon: Calculator },
];

export const recentApplicationsData = [
    { name: "John Doe", program: "Teknik Mesin", status: "Pending", date: "2024-07-20" },
    { name: "Jane Smith", program: "Akuntansi", status: "Reviewed", date: "2024-07-19" },
    { name: "Peter Jones", program: "Multimedia", status: "Accepted", date: "2024-07-18" },
    { name: "Mary Williams", program: "Pemasaran", status: "Pending", date: "2024-07-20" },
    { name: "David Brown", program: "Teknik Mesin", status: "Rejected", date: "2024-07-17" },
];
