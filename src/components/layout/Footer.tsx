
import Link from 'next/link';
import { BookHeart, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/programs', label: 'Program' },
  { href: '/news', label: 'Berita' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/admissions', label: 'Penerimaan' },
  { href: '/contact', label: 'Kontak' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 md:grid-cols-4 md:px-6">
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <BookHeart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">
              SMK LPPMRI 2
            </span>
          </Link>
          <p className="text-sm">
            Menyediakan pendidikan kejuruan berkualitas untuk generasi profesional berikutnya.
          </p>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5 hover:text-primary transition-colors" /></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
          <div>
            <h3 className="font-headline font-semibold">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors" prefetch={false}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Hubungi Kami</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Jl. Raya Kedungreja No.1</li>
              <li>Kedungreja, Cilacap</li>
              <li>Jawa Tengah, Indonesia</li>
              <li className="pt-2">
                <a href="tel:+621234567890" className="hover:text-primary transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@smklppmri2.sch.id" className="hover:text-primary transition-colors">
                  info@smklppmri2.sch.id
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-headline font-semibold">Buletin</h3>
            <p className="mt-4 text-sm">Tetap terinformasi dengan berita dan acara terbaru kami.</p>
            <form className="mt-4 flex gap-2">
              <Input type="email" placeholder="Masukkan email Anda" className="bg-background" />
              <Button type="submit" variant="default">Langganan</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-sm md:flex-row md:px-6">
          <p>&copy; {new Date().getFullYear()} SMK LPPMRI 2 Kedungreja. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary transition-colors">Ketentuan Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
