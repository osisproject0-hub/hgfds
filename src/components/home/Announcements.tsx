import { Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function Announcements() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-2 text-sm md:px-6">
        <Megaphone className="h-5 w-5" />
        <p className="font-medium">
          Pendaftaran Siswa Baru 2024/2025 sekarang dibuka!
        </p>
        <Link href="/admissions" className="ml-4 font-semibold underline underline-offset-2 hover:text-accent transition-colors" prefetch={false}>
          Pelajari Lebih Lanjut
        </Link>
      </div>
    </div>
  );
}
