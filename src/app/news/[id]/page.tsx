
"use client"

import Image from "next/image"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar, User, ArrowLeft } from "lucide-react"

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate: any; // Firestore timestamp
  imageUrl: string;
};

export default function NewsDetailPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const articleRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, "newsArticles", params.id);
    }, [firestore, params.id]);

    const { data: article, isLoading } = useDoc<NewsArticle>(articleRef);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <Skeleton className="h-96 w-full rounded-lg" />
                 <div className="mt-8 max-w-4xl mx-auto">
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <div className="flex gap-4 mb-8">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-5/6" />
                 </div>
            </div>
        )
    }

    if (!article) {
        return <div className="text-center py-20">Artikel tidak ditemukan.</div>
    }

    return (
        <div className="bg-background text-foreground">
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <Button asChild variant="outline" className="mb-8">
                        <Link href="/news">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Semua Berita
                        </Link>
                    </Button>
                    <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline mb-4">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-8 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {article.publicationDate ? format(new Date(article.publicationDate.seconds * 1000), "dd MMMM yyyy", { locale: id }) : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                             <User className="h-4 w-4" />
                            <span>Oleh: {article.author}</span>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap">
                        {article.content}
                    </div>
                </div>
            </main>
        </div>
    )
}
