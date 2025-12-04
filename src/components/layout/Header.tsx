
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/app/admin/settings/page';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/programs', label: 'Program' },
  { href: '/news', label: 'Berita' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/admissions', label: 'Penerimaan' },
  { href: '/contact', label: 'Kontak' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore]);
  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsDocRef);
  const schoolName = settings?.schoolName || "SMK LPPMRI 2";


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png" alt="Logo" width={32} height={32} />
          {isLoading ? 
            <Skeleton className="h-6 w-32" /> :
            <span className="text-xl font-bold font-headline text-foreground">
                {schoolName}
            </span>
          }
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/admissions">Daftar Sekarang</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka menu navigasi</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                  <Image src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png" alt="Logo" width={32} height={32} />
                  <span className="text-xl font-bold font-headline text-foreground">
                    {schoolName}
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/70 transition-colors hover:text-foreground"
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button asChild className="mt-4">
                  <Link href="/admissions">Daftar Sekarang</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
