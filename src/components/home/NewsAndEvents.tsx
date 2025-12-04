
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

type NewsArticle = {
  id: string;
  title: string;
  category?: string;
  publicationDate: any; // Firestore timestamp
  imageUrl: string;
};

export default function NewsAndEvents() {
  const firestore = useFirestore();
  const articlesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, "newsArticles"), orderBy("publicationDate", "desc"), limit(3));
  }, [firestore]);

  const { data: articles, isLoading } = useCollection<NewsArticle>(articlesQuery);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Latest News & Events</h2>
            <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
              Stay up-to-date with the latest happenings at our school.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/news">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
               <Skeleton className="h-56 w-full" />
               <CardContent className="p-6">
                   <div className="flex justify-between items-center mb-2">
                     <Skeleton className="h-5 w-20" />
                     <Skeleton className="h-4 w-24" />
                   </div>
                   <Skeleton className="h-6 w-full" />
               </CardContent>
            </Card>
          ))}
          {articles && articles.map((post) => (
            <Card key={post.id} className="group overflow-hidden">
              <Link href={`/news/${post.id}`} className="block">
                <CardContent className="p-0">
                  <div className="relative h-56 w-full">
                    <Image
                      src={post.imageUrl}
                      alt={`Image for ${post.title}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                       <Badge variant={post.category === 'Announcement' ? 'destructive' : 'secondary'}>{post.category || 'Berita'}</Badge>
                       <p className="text-sm text-muted-foreground">{post.publicationDate ? format(new Date(post.publicationDate.seconds * 1000), 'MMM d, yyyy') : ''}</p>
                    </div>
                    <h3 className="text-lg font-bold font-headline leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
         {!isLoading && articles?.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
                <p>Belum ada berita yang dipublikasikan.</p>
            </div>
        )}
      </div>
    </section>
  );
}
