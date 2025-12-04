
"use client"

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, limit } from "firebase/firestore"
import { Skeleton } from '../ui/skeleton';
import { Wrench, Calculator, Camera, LineChart } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  'Teknik Mesin': Wrench,
  'Akuntansi': Calculator,
  'Multimedia': Camera,
  'Pemasaran': LineChart,
  'default': Wrench,
};

type Program = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function FeaturedPrograms() {
  const firestore = useFirestore();
  const programsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, "vocationalPrograms"), limit(4));
  }, [firestore]);

  const { data: programs, isLoading } = useCollection<Program>(programsQuery);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Program Kejuruan Kami</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Kami menawarkan berbagai program khusus yang dirancang untuk membekali siswa dengan keterampilan yang paling dibutuhkan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
             <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-full mt-6" />
                </CardContent>
             </Card>
          ))}
          {programs && programs.map((program) => {
            const ProgramIcon = iconMap[program.name] || iconMap.default;
            return (
              <Card key={program.id} className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0">
                  <Link href={`/programs/${program.id}`} className="block">
                    <div className="relative h-48 w-full">
                      <Image
                        src={program.imageUrl}
                        alt={program.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <ProgramIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold font-headline">
                         <Link href={`/programs/${program.id}`}>{program.name}</Link>
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6 min-h-[60px] line-clamp-3">{program.description}</p>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/programs/${program.id}`}>
                        Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
         {!isLoading && programs?.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
                <p>Belum ada program unggulan yang tersedia.</p>
            </div>
        )}
      </div>
    </section>
  );
}
