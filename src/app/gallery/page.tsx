
"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

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

    const { data: albums, isLoading } = useCollection<GalleryAlbum>(albumsQuery);
    
    const allImages = albums?.flatMap(album => 
        album.imageUrls.map(url => ({
            id: `${album.id}-${url}`,
            imageUrl: url,
            description: album.name,
            category: album.name
        }))
    ) || [];

    const galleryCategories = ["All", ...(albums?.map(a => a.name) || [])];

    return (
        <div className="bg-background text-foreground">
            <div className="bg-secondary">
                <div className="container mx-auto px-4 md:px-6 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-headline">Galeri Sekolah</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Lihat momen-momen, fasilitas, dan kegiatan di SMK LPPMRI 2 Kedungreja.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                {isLoading ? (
                     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                 <Tabs defaultValue="All" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList>
                            {galleryCategories.map(category => (
                                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <TabsContent value="All">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {allImages.map((image, index) => (
                                <Card key={`${image.id}-${index}`} className="overflow-hidden group cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-square w-full">
                                            <Image
                                                src={image.imageUrl || "https://picsum.photos/600/600"}
                                                alt={image.description || "Gallery image"}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <p className="text-white text-sm font-semibold">{image.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {albums?.map(album => (
                        <TabsContent key={album.id} value={album.name}>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {album.imageUrls.map((url, index) => (
                                    <Card key={`${album.id}-${url}-${index}`} className="overflow-hidden group cursor-pointer">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-square w-full">
                                                <Image
                                                    src={url || "https://picsum.photos/600/600"}
                                                    alt={`${album.name} - image ${index + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
                )}

                 {!isLoading && allImages?.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground col-span-full">
                        <p>Belum ada album atau gambar di galeri.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
