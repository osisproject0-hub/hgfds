"use client"

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const galleryCategories = ["All", "Campus", "Events", "Students", "Programs"];
const galleryImages = [
    { id: "hero-bg", category: "Students" },
    { id: "program-mesin", category: "Programs" },
    { id: "program-akuntansi", category: "Programs" },
    { id: "program-multimedia", category: "Programs" },
    { id: "about-preview", category: "Campus" },
    { id: "news-1", category: "Students" },
    { id: "news-2", category: "Events" },
    { id: "news-3", category: "Campus" },
];

export default function GalleryPage() {
    const imagesWithData = galleryImages.map(img => ({
        ...PlaceHolderImages.find(p => p.id === img.id),
        category: img.category
    })).filter(Boolean);

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
                 <Tabs defaultValue="All" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList>
                            {galleryCategories.map(category => (
                                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {galleryCategories.map(category => (
                        <TabsContent key={category} value={category}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {imagesWithData
                                    .filter(image => category === "All" || image.category === category)
                                    .map((image, index) => (
                                        <Card key={`${image.id}-${index}`} className="overflow-hidden group cursor-pointer">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-square w-full">
                                                    <Image
                                                        src={image.imageUrl || "https://picsum.photos/600/600"}
                                                        alt={image.description || "Gallery image"}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                        data-ai-hint={image.imageHint}
                                                    />
                                                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                                        <p className="text-white text-center text-sm">{image.description}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    )
}
