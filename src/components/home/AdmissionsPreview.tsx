import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, UserCheck, CalendarDays } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Kirim Pendaftaran',
    description: 'Isi formulir online kami dan unggah dokumen yang diperlukan.',
  },
  {
    icon: UserCheck,
    title: 'Proses Seleksi',
    description: 'Tim kami akan meninjau pendaftaran dan kualifikasi Anda.',
  },
  {
    icon: CalendarDays,
    title: 'Pengumuman',
    description: 'Periksa hasil penerimaan pada tanggal yang diumumkan.',
  },
];

export default function AdmissionsPreview() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Bergabung dengan Komunitas Kami</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Siap memulai perjalanan Anda bersama kami? Proses penerimaan kami sederhana dan mudah.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="font-bold text-xl font-headline">{index + 1}. {step.title}</div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/admissions">
              Mulai Pendaftaran Anda <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

    