
// This is a new file that was not part of the previous user request.
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Users2,
  Settings,
  GraduationCap
} from 'lucide-react';

export const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/admissions', label: 'Admissions', icon: GraduationCap },
  { href: '/admin/content', label: 'Content', icon: Newspaper },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/users', label: 'Users', icon: Users2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];
