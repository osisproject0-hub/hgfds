

"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Images } from "lucide-react"
import type { SiteSettings } from "@/app/admin/settings/page"

type GalleryAlbum = {
    id: string;
    name: string;
    description: string;
    imageUrls: string[];
};

export default function GalleryPage() {
    const firestore = useFirestore();
    const albumsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "galleryAlbums"));
    }, [firestore]);

    const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore])
    const { data: settings } = useDoc<SiteSettings>(settingsDocRef)

    const { data: albums, isLoading } = useCollection<GalleryAlbum>(albumsQuery);
    
    const heroImage = settings?.galleryHeroImageUrl || "https://picsum.photos/seed/gallery-hero/1200/400";


    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-64 md:h-80 w-full flex items-center justify-center text-center text-white">
                 <Image
                    src={heroImage}
                    alt="Galeri Sekolah"
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="school gallery"
                />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-headline">
                        Galeri Sekolah
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                        Lihat momen-momen, fasilitas, dan kegiatan di SMK LPPMRI 2 Kedungreja.
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                           <Skeleton className="h-56 w-full" />
                           <CardHeader>
                               <Skeleton className="h-6 w-3/4" />
                               <Skeleton className="h-4 w-full mt-2" />
                           </CardHeader>
                           <CardContent>
                                <Skeleton className="h-5 w-1/4" />
                           </CardContent>
                        </Card>
                     ))}
                     {albums?.map(album => (
                        <Card key={album.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg group">
                            <Link href={`/gallery/${album.id}`} className="block">
                               <div className="relative h-56 w-full">
                                   <Image 
                                       src={album.imageUrls?.[0] || "https://picsum.photos/seed/placeholder/600/400"} 
                                       alt={`Sampul untuk ${album.name}`}
                                       fill
                                       className="object-cover transition-transform group-hover:scale-105"
                                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                   />
                               </div>
                            </Link>
                           <CardHeader className="flex-grow">
                               <CardTitle className="text-xl font-headline text-primary">
                                 <Link href={`/gallery/${album.id}`}>{album.name}</Link>
                               </CardTitle>
                               <CardDescription className="line-clamp-2">{album.description}</CardDescription>
                           </CardHeader>
                           <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Images className="h-4 w-4 mr-2" />
                                    <span>{album.imageUrls?.length || 0} foto</span>
                                </div>
                           </CardContent>
                       </Card>
                     ))}
                </div>

                 {!isLoading && albums?.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground col-span-full">
                        <p>Belum ada album di galeri.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
