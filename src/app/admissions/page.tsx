"use client"

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "@/components/ui/button"
import { FileText, UserCheck, CalendarDays, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const admissionRequirements = [
  "Fotokopi Ijazah SMP/sederajat (legalisir)",
  "Fotokopi Kartu Keluarga (KK)",
  "Fotokopi Akta Kelahiran",
  "Pas Foto ukuran 3x4 (2 lembar)",
  "Mengisi Formulir Pendaftaran",
];

const faqs = [
  {
    question: "Kapan pendaftaran dibuka?",
    answer: "Pendaftaran untuk tahun ajaran baru biasanya dibuka mulai bulan Mei hingga Juli. Silakan pantau pengumuman resmi di situs web kami."
  },
  {
    question: "Apakah ada tes masuk?",
    answer: "Ya, kami mengadakan tes seleksi yang meliputi tes potensi akademik dan wawancara untuk menentukan minat dan bakat calon siswa."
  },
  {
    question: "Berapa biaya pendaftarannya?",
    answer: "Biaya pendaftaran dapat bervariasi setiap tahunnya. Informasi detail mengenai biaya akan diumumkan bersamaan dengan pembukaan pendaftaran."
  },
   {
    question: "Program keahlian apa saja yang tersedia?",
    answer: "Kami memiliki beberapa program keahlian unggulan, termasuk Teknik Mesin, Akuntansi, Multimedia, dan Pemasaran. Detailnya bisa dilihat di halaman Program."
  }
];


export default function AdmissionsPage() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'news-2');

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
                        Penerimaan Siswa Baru
                    </h1>
                    <p className="mt-2 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                        Bergabunglah dengan kami dan mulailah perjalanan Anda menuju karir profesional.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">

                {/* Admission Steps */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                            Proses Pendaftaran
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Proses penerimaan kami dirancang agar sederhana dan transparan. Ikuti langkah-langkah di bawah ini.
                        </p>
                    </div>
                    <div className="relative">
                         <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                         <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-primary-foreground border-4 border-background z-10">
                                    <FileText className="h-10 w-10" />
                                </div>
                                <h3 className="font-bold text-xl font-headline mt-2">1. Pengajuan Aplikasi</h3>
                                <p className="text-muted-foreground">Isi formulir online kami dan unggah dokumen yang diperlukan.</p>
                            </div>
                             <div className="flex flex-col items-center text-center gap-4">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-primary-foreground border-4 border-background z-10">
                                    <UserCheck className="h-10 w-10" />
                                </div>
                                <h3 className="font-bold text-xl font-headline mt-2">2. Proses Seleksi</h3>
                                <p className="text-muted-foreground">Tim kami akan meninjau aplikasi dan kualifikasi Anda.</p>
                            </div>
                             <div className="flex flex-col items-center text-center gap-4">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-primary-foreground border-4 border-background z-10">
                                    <CalendarDays className="h-10 w-10" />
                                </div>
                                <h3 className="font-bold text-xl font-headline mt-2">3. Pengumuman</h3>
                                <p className="text-muted-foreground">Periksa hasil penerimaan pada tanggal yang diumumkan.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Requirements & FAQ */}
                <section className="grid md:grid-cols-2 gap-12 items-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Persyaratan Pendaftaran</CardTitle>
                            <CardDescription>Pastikan Anda telah menyiapkan semua dokumen yang diperlukan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {admissionRequirements.map((req, index) => (
                                    <li key={index} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                                        <span className="text-muted-foreground">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Pertanyaan Umum (FAQ)</CardTitle>
                            <CardDescription>Jawaban atas pertanyaan yang sering diajukan tentang pendaftaran.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </section>

                 {/* Call to Action */}
                <section className="text-center mt-20">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Siap Bergabung?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Jangan lewatkan kesempatan untuk menjadi bagian dari komunitas kami.
                    </p>
                    <Button size="lg" className="mt-8">
                        Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </section>
            </main>
        </div>
    )
}
