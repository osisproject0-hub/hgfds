"use client"

import Image from "next/image"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Briefcase, GraduationCap, CheckCircle } from "lucide-react"

type Program = {
  id: string;
  name: string;
  description: string;
  careerProspects: string;
  imageUrl: string;
};

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const programRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, "vocationalPrograms", params.id);
    }, [firestore, params.id]);

    const { data: program, isLoading } = useDoc<Program>(programRef);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-12">
                <Skeleton className="h-80 w-full rounded-lg" />
                <div className="mt-8 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-5/6" />
                    </div>
                    <div>
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-5 w-4/5" />
                    </div>
                </div>
            </div>
        )
    }

    if (!program) {
        return <div className="text-center py-20">Program tidak ditemukan.</div>
    }

    const careerList = program.careerProspects.split(',').map(c => c.trim());

    return (
        <div className="bg-background text-foreground">
            <section className="relative h-72 md:h-96 w-full flex items-center justify-center text-center text-white">
                <Image
                    src={program.imageUrl}
                    alt={program.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl font-headline">
                        {program.name}
                    </h1>
                </div>
            </section>

            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <div className="prose prose-lg max-w-none text-muted-foreground">
                            <h2 className="text-3xl font-bold font-headline text-primary mb-4 flex items-center gap-3">
                                <GraduationCap className="h-8 w-8" />
                                Deskripsi Program
                            </h2>
                            <p>{program.description}</p>
                            
                            <p>
                                Di program {program.name}, siswa akan dibekali dengan berbagai keterampilan teknis dan soft skill yang dibutuhkan oleh industri. Kurikulum kami dirancang bekerja sama dengan para ahli industri untuk memastikan relevansi dan keunggulannya.
                            </p>
                        </div>
                    </div>
                    
                    <aside>
                        <div className="bg-secondary p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold font-headline text-primary mb-4 flex items-center gap-3">
                                <Briefcase className="h-6 w-6"/>
                                Prospek Karir
                            </h3>
                            <ul className="space-y-3">
                                {careerList.map((career, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                                        <span>{career}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
                
                <div className="mt-20 text-center bg-primary/5 border border-primary/20 rounded-lg p-10">
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Tertarik dengan Program Ini?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Mulai perjalanan karir Anda dengan mendaftar di program {program.name} sekarang juga.
                    </p>
                    <Button size="lg" className="mt-8" asChild>
                        <Link href="/apply">
                            Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </main>
        </div>
    )
}
