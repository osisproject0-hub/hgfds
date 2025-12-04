
"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

type Program = {
  id: string;
  name: string;
  description: string;
  careerProspects: string;
  imageUrl: string;
};

export default function ProgramsPage() {
    const firestore = useFirestore();
    const programsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "vocationalPrograms"));
    }, [firestore]);

    const { data: programs, isLoading } = useCollection<Program>(programsQuery);

    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6 py-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-headline">
                        Program Kejuruan
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                        Temukan keahlian yang tepat untuk masa depan Anda di SMK LPPMRI 2 Kedungreja.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                        Program Unggulan Kami
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Kami menawarkan berbagai program kejuruan yang dirancang untuk membekali siswa dengan keterampilan praktis dan pengetahuan mendalam yang relevan dengan kebutuhan industri saat ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                     {isLoading && Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                           <Skeleton className="h-56 w-full" />
                           <CardHeader>
                               <Skeleton className="h-6 w-3/4" />
                               <Skeleton className="h-4 w-full mt-2" />
                           </CardHeader>
                           <CardContent>
                               <Skeleton className="h-5 w-1/4 mb-2" />
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-full mt-1" />
                               <Skeleton className="h-10 w-full mt-4" />
                           </CardContent>
                        </Card>
                     ))}
                     {programs?.map(program => (
                        <Card key={program.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                            <Link href={`/programs/${program.id}`} className="block">
                               <div className="relative h-56 w-full">
                                   <Image 
                                       src={program.imageUrl} 
                                       alt={`Gambar untuk ${program.name}`}
                                       fill
                                       className="object-cover"
                                       sizes="(max-width: 768px) 100vw, 50vw"
                                   />
                               </div>
                            </Link>
                           <CardHeader>
                               <CardTitle className="text-2xl font-headline text-primary">
                                 <Link href={`/programs/${program.id}`}>{program.name}</Link>
                                </CardTitle>
                               <CardDescription className="line-clamp-3">{program.description}</CardDescription>
                           </CardHeader>
                           <CardContent className="flex-grow flex flex-col">
                                <div className="flex-grow">
                                   <h4 className="font-semibold mb-2 text-foreground">Prospek Karir</h4>
                                   <p className="text-sm text-muted-foreground line-clamp-2">{program.careerProspects}</p>
                                </div>
                                <Button asChild variant="outline" className="mt-4 w-full">
                                    <Link href={`/programs/${program.id}`}>Lihat Detail</Link>
                                </Button>
                           </CardContent>
                       </Card>
                     ))}
                </div>

                 {!isLoading && programs?.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Belum ada program kejuruan yang tersedia saat ini.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
