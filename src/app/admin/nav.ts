
import {
  LayoutDashboard,
  Newspaper,
  Users2,
  Settings,
  Mail,
  GraduationCap,
} from 'lucide-react';

export const adminNavLinks = [
  { href: '/admin', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/admin/admissions', label: 'Pendaftaran', icon: GraduationCap },
  { href: '/admin/content', label: 'Konten', icon: Newspaper },
  { href: '/admin/students', label: 'Siswa', icon: GraduationCap },
  { href: '/admin/messages', label: 'Pesan', icon: Mail },
  { href: '/admin/users', label: 'Guru & Staff', icon: Users2 },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];
