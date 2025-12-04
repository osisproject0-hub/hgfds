"use client"

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const missionPoints = [
    { text: "Menyelenggarakan pendidikan yang berorientasi pada keahlian dan kebutuhan industri." },
    { text: "Membentuk siswa yang berakhlak mulia, disiplin, dan bertanggung jawab." },
    { text: "Mengembangkan potensi siswa melalui kegiatan ekstrakurikuler yang beragam." },
    { text: "Membangun kerjasama yang erat dengan dunia usaha dan dunia industri (DUDI)." },
    { text: "Menjadi lembaga pendidikan yang inovatif dan adaptif terhadap perkembangan zaman." },
];

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'about-preview');
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-64 md:h-80 w-full flex items-center justify-center text-center text-white">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint={heroImage.imageHint}
                    />
                )}
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
                        {aboutImage && (
                            <Image
                                src={aboutImage.imageUrl}
                                alt={aboutImage.description}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                data-ai-hint={aboutImage.imageHint}
                            />
                        )}
                    </div>
                </div>

                {/* Visi & Misi Section */}
                <div className="mt-20 text-center">
                     <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                        Visi & Misi
                    </h2>
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-8 items-start">
                    <div className="bg-secondary p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-bold font-headline text-primary mb-4">Visi</h3>
                        <p className="text-lg text-muted-foreground">
                            "Menjadi lembaga pendidikan kejuruan unggulan yang menghasilkan lulusan profesional, berkarakter, dan mampu bersaing di era global."
                        </p>
                    </div>
                     <div className="bg-secondary p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-bold font-headline text-primary mb-4">Misi</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            {missionPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-primary font-bold mr-3">✓</span>
                                    <span>{point.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
