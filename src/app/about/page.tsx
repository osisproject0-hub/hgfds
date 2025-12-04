
"use client"

import Image from "next/image"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import type { SiteSettings } from "@/app/admin/settings/page"

export default function AboutPage() {
    const firestore = useFirestore()
    const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore])
    const { data: settings, isLoading } = useDoc<SiteSettings>(settingsDocRef)
    
    const heroImage = settings?.aboutHeroImageUrl || "https://picsum.photos/seed/about-hero/1200/400";
    
    const VisionSkeleton = () => (
        <div className="bg-secondary p-8 rounded-lg shadow-sm">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5 mt-2" />
        </div>
    )

    const MissionSkeleton = () => (
        <div className="bg-secondary p-8 rounded-lg shadow-sm">
            <Skeleton className="h-8 w-24 mb-4" />
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )


    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-64 md:h-80 w-full flex items-center justify-center text-center text-white">
                <Image
                    src={heroImage}
                    alt="Gedung sekolah dari luar"
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="school building"
                />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-headline">
                        Tentang SMK LPPMRI 2 Kedungreja
                    </h1>
                    <p className="mt-2 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                        Mengenal lebih dekat visi, misi, dan sejarah sekolah kami.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-primary">
                            Tradisi Unggul dalam Pendidikan Vokasi
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Sejak didirikan, SMK LPPMRI 2 Kedungreja telah berkomitmen untuk menyediakan pendidikan kejuruan berkualitas yang relevan dengan standar industri. Visi kami adalah mencetak lulusan yang kompeten, kreatif, dan berdaya saing global.
                        </p>
                        <p className="text-muted-foreground">
                            Kami percaya pada pendekatan pendidikan holistik, yang mengintegrasikan pembelajaran akademik yang ketat dengan pengalaman praktik langsung di fasilitas modern kami. Kami mempersiapkan siswa tidak hanya untuk bekerja, tetapi juga untuk berkontribusi secara signifikan bagi masyarakat.
                        </p>
                    </div>
                    <div className="relative h-80 w-full lg:h-[400px] rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <Image
                            src="https://picsum.photos/seed/about-content/600/800"
                            alt="Siswa belajar di kelas"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            data-ai-hint="students classroom"
                        />
                    </div>
                </div>

                {/* Visi & Misi Section */}
                <div className="mt-20 text-center">
                     <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                        Visi & Misi
                    </h2>
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-8 items-start">
                   {isLoading ? (
                    <>
                        <VisionSkeleton />
                        <MissionSkeleton />
                    </>
                   ) : settings ? (
                    <>
                        <div className="bg-secondary p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl font-bold font-headline text-primary mb-4">Visi</h3>
                            <p className="text-lg text-muted-foreground">
                                &quot;{settings.vision || "Visi belum diatur."}&quot;
                            </p>
                        </div>
                         <div className="bg-secondary p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl font-bold font-headline text-primary mb-4">Misi</h3>
                            <ul className="space-y-3 text-muted-foreground">
                                {settings.missionPoints?.length > 0 ? (
                                    settings.missionPoints.map((point, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-primary font-bold mr-3">✓</span>
                                            <span>{point.text}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li>Misi belum diatur.</li>
                                )}
                            </ul>
                        </div>
                    </>
                   ) : (
                        <p className="col-span-2 text-center">Visi dan Misi tidak dapat dimuat.</p>
                   )}
                </div>
            </main>
        </div>
    )
}
