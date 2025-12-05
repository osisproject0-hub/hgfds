

"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { SiteSettings } from "@/app/admin/settings/page"
import { Badge } from "@/components/ui/badge"

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate: any; // Firestore timestamp
  imageUrl: string;
  category?: string;
};

export default function NewsPage() {
    const firestore = useFirestore();
    const articlesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "newsArticles"), orderBy("publicationDate", "desc"));
    }, [firestore]);
    
    const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore])
    const { data: settings } = useDoc<SiteSettings>(settingsDocRef)

    const { data: articles, isLoading } = useCollection<NewsArticle>(articlesQuery);

    const heroImage = settings?.newsHeroImageUrl || "https://picsum.photos/seed/news-hero/1200/400";

    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-64 md:h-80 w-full flex items-center justify-center text-center text-white">
                 <Image
                    src={heroImage}
                    alt="Berita Sekolah"
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="news events"
                />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-headline">
                        Berita & Acara
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                        Ikuti terus informasi dan kegiatan terbaru dari sekolah kami.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden flex flex-col">
                           <Skeleton className="h-56 w-full" />
                           <CardHeader>
                               <Skeleton className="h-4 w-1/3" />
                               <Skeleton className="h-6 w-full mt-2" />
                           </CardHeader>
                           <CardContent className="flex-grow">
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-full mt-2" />
                           </CardContent>
                           <CardFooter>
                               <Skeleton className="h-10 w-full" />
                           </CardFooter>
                        </Card>
                     ))}
                     {articles?.map(article => (
                        <Card key={article.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                            <Link href={`/news/${article.id}`} className="block">
                               <div className="relative h-56 w-full">
                                   <Image 
                                       src={article.imageUrl} 
                                       alt={`Gambar untuk ${article.title}`}
                                       fill
                                       className="object-cover"
                                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                   />
                               </div>
                            </Link>
                           <CardHeader>
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>
                                        {article.publicationDate ? format(new Date(article.publicationDate.seconds * 1000), "dd MMMM yyyy", { locale: id }) : ''}
                                    </span>
                                    {article.category && <Badge variant="outline">{article.category}</Badge>}
                                </div>
                               <CardTitle className="text-xl font-headline text-primary mt-1">
                                 <Link href={`/news/${article.id}`}>{article.title}</Link>
                               </CardTitle>
                           </CardHeader>
                           <CardContent className="flex-grow">
                               <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                           </CardContent>
                            <CardFooter>
                               <Button asChild variant="secondary" className="w-full">
                                   <Link href={`/news/${article.id}`}>
                                       Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                                   </Link>
                               </Button>
                           </CardFooter>
                       </Card>
                     ))}
                </div>

                 {!isLoading && articles?.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground col-span-full">
                        <p>Belum ada berita atau acara yang dipublikasikan.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
