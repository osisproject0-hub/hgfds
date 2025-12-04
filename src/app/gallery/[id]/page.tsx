
"use client"

import Image from "next/image"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Image as ImageIcon } from "lucide-react"

type GalleryAlbum = {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
};

export default function GalleryAlbumPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const albumRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, "galleryAlbums", params.id);
    }, [firestore, params.id]);

    const { data: album, isLoading } = useDoc<GalleryAlbum>(albumRef);

    if (isLoading) {
        return (
             <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <Skeleton className="h-10 w-48 mb-8" />
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4 mb-12" />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                    ))}
                </div>
            </main>
        )
    }

    if (!album) {
        return (
             <div className="container mx-auto px-4 md:px-6 py-20 text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-2xl font-bold mb-2">Album Tidak Ditemukan</h1>
                <p className="text-muted-foreground mb-6">Album yang Anda cari mungkin telah dihapus atau tidak pernah ada.</p>
                 <Button asChild>
                    <Link href="/gallery">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Galeri
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground">
             <div className="bg-secondary">
                <div className="container mx-auto px-4 md:px-6 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-headline">{album.name}</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {album.description}
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                 <Button asChild variant="outline" className="mb-8">
                    <Link href="/gallery">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Semua Album
                    </Link>
                </Button>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {album.imageUrls?.map((url, index) => (
                        <div key={`${album.id}-${index}`} className="overflow-hidden rounded-lg group cursor-pointer aspect-square relative">
                            <Image
                                src={url || "https://picsum.photos/600/600"}
                                alt={`${album.name} - gambar ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        </div>
                    ))}
                </div>

                {!album.imageUrls || album.imageUrls.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground col-span-full">
                        <p>Album ini belum memiliki gambar.</p>
                    </div>
                )}
            </main>
        </div>
    )
}

