
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/app/admin/settings/page';
import { Skeleton } from '../ui/skeleton';

export default function AboutPreview() {
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore]);
  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsDocRef);
  const aboutImage = settings?.aboutPreviewImageUrl || "https://picsum.photos/seed/about-preview/600/450";

  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
             {isLoading ? (
                <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-full mt-4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-12 w-48 mt-4" />
                </>
             ) : (
                <>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                        Tradisi Keunggulan dalam Pendidikan Vokasi
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {settings?.aboutPreview || "Sejak didirikan, SMK LPPMRI 2 Kedungreja berkomitmen untuk menyediakan pelatihan vokasi berkualitas tinggi yang memenuhi standar industri. Visi kami adalah menghasilkan lulusan yang kompeten, kreatif, dan kompetitif yang siap membuat perbedaan."}
                    </p>
                    <p className="text-muted-foreground">
                        Kami percaya pada pendekatan holistik dalam pendidikan, menggabungkan pembelajaran akademik yang ketat dengan pengalaman praktik langsung di fasilitas canggih kami.
                    </p>
                    <Button size="lg" asChild>
                    <Link href="/about">
                        Temukan Kisah Kami <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    </Button>
                </>
             )}
          </div>
          <div className="relative h-80 w-full lg:h-[450px] rounded-xl overflow-hidden shadow-lg">
            <Image
                src={aboutImage}
                alt="Gedung sekolah dari depan"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                data-ai-hint="school building front"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
