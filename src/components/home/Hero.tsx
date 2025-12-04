
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/app/admin/settings/page';
import { Skeleton } from '../ui/skeleton';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore]);
  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsDocRef);

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-primary/40" />
      <div className="relative z-10 flex flex-col items-center gap-6 p-4">
        {isLoading ? (
            <>
                <Skeleton className="h-16 w-[80vw] max-w-3xl" />
                <Skeleton className="h-8 w-[60vw] max-w-xl mt-2" />
                <Skeleton className="h-12 w-full max-w-lg mt-6" />
            </>
        ) : (
            <>
                <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl font-headline">
                    {settings?.heroHeadline || "Membangun Profesional Masa Depan"}
                </h1>
                <p className="max-w-3xl text-lg md:text-xl text-primary-foreground/90">
                    {settings?.heroSubheadline || "Selamat datang di SMK LPPMRI 2 Kedungreja, tempat kami membina bakat dan keterampilan untuk karir yang sukses di dunia kejuruan."}
                </p>
            </>
        )}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/programs">
              Jelajahi Program Kami <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
            <PlayCircle className="mr-2 h-5 w-5" /> Tonton Tur Sekolah
          </Button>
        </div>
      </div>
    </section>
  );
}

    