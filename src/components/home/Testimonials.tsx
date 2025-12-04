
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
};

const TestimonialSkeleton = () => (
  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
    <div className="p-1">
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Skeleton className="w-20 h-20 rounded-full mb-4" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6 mb-4" />
          <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5" />)}
          </div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    </div>
  </CarouselItem>
);

export default function Testimonials() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "testimonials"));
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Apa Kata Komunitas Kami</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Dengarkan dari siswa, orang tua, dan alumni kami tentang pengalaman mereka.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {isLoading && Array.from({ length: 3 }).map((_, i) => <TestimonialSkeleton key={i} />)}
            {testimonials && testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <Image
                        src={testimonial.imageUrl || "https://picsum.photos/seed/person/100"}
                        alt={`Foto ${testimonial.name}`}
                        width={80}
                        height={80}
                        className="rounded-full mb-4 border-4 border-primary/10"
                      />
                      <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                      <div className="flex text-yellow-400 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                      </div>
                      <h3 className="font-bold font-headline">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
        {!isLoading && testimonials?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
              <p>Belum ada testimoni yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </section>
  );
}
