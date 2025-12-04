

"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, PlusCircle, Trash2 } from "lucide-react"
import { useFirestore, useDoc, setDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const generalFormSchema = z.object({
  schoolName: z.string().min(5, { message: "Nama sekolah harus memiliki setidaknya 5 karakter." }),
  address: z.string().min(10, { message: "Alamat harus memiliki setidaknya 10 karakter." }),
  phone: z.string().min(10, { message: "Nomor telepon harus valid." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  announcementText: z.string().optional(),
  announcementLink: z.string().url().or(z.literal('')).optional(),
})

const homeFormSchema = z.object({
    heroHeadline: z.string().optional(),
    heroSubheadline: z.string().optional(),
    aboutPreview: z.string().optional(),
    statsStudents: z.coerce.number().optional(),
    statsTeachers: z.coerce.number().optional(),
    statsGraduationRate: z.coerce.number().optional(),
})

const aboutFormSchema = z.object({
    vision: z.string().optional(),
    missionPoints: z.array(z.object({ text: z.string().min(1, "Misi tidak boleh kosong.") })).optional(),
})

const admissionsFormSchema = z.object({
    admissionRequirements: z.array(z.object({ text: z.string().min(1, "Persyaratan tidak boleh kosong.") })).optional(),
    admissionFaqs: z.array(z.object({ 
        question: z.string().min(1, "Pertanyaan tidak boleh kosong."),
        answer: z.string().min(1, "Jawaban tidak boleh kosong."),
    })).optional(),
})

const imagesFormSchema = z.object({
  heroImageUrl: z.string().url().or(z.literal('')).optional(),
  aboutPreviewImageUrl: z.string().url().or(z.literal('')).optional(),
  aboutHeroImageUrl: z.string().url().or(z.literal('')).optional(),
  programsHeroImageUrl: z.string().url().or(z.literal('')).optional(),
  admissionsHeroImageUrl: z.string().url().or(z.literal('')).optional(),
  newsHeroImageUrl: z.string().url().or(z.literal('')).optional(),
  galleryHeroImageUrl: z.string().url().or(z.literal('')).optional(),
})

const combinedSchema = generalFormSchema.merge(homeFormSchema).merge(aboutFormSchema).merge(admissionsFormSchema).merge(imagesFormSchema);
export type SiteSettings = z.infer<typeof combinedSchema>;


export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "siteSettings", "main");
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsDocRef);

  const form = useForm<SiteSettings>({
    resolver: zodResolver(combinedSchema),
    values: settings || {
      schoolName: "",
      address: "",
      phone: "",
      email: "",
    }
  })
  
  const { fields: missionFields, append: appendMission, remove: removeMission } = useFieldArray({
    control: form.control,
    name: "missionPoints"
  });

  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control: form.control,
    name: "admissionRequirements"
  });

   const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "admissionFaqs"
  });

  function onSubmit(values: SiteSettings) {
    startTransition(async () => {
      if (!settingsDocRef) return;

      try {
        await setDocumentNonBlocking(settingsDocRef, values, { merge: true });
        toast({ title: "Berhasil", description: "Pengaturan berhasil diperbarui." });
      } catch (error) {
        console.error("Error saving settings:", error);
        toast({
          variant: "destructive",
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan. Silakan coba lagi.",
        })
      }
    })
  }
  
  const formSectionClass = "space-y-6 max-w-2xl"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Situs</CardTitle>
        <CardDescription>
          Kelola informasi umum yang ditampilkan di seluruh situs web Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
         <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="general">Umum</TabsTrigger>
                <TabsTrigger value="home">Halaman Depan</TabsTrigger>
                <TabsTrigger value="about">Tentang Kami</TabsTrigger>
                <TabsTrigger value="admissions">Penerimaan</TabsTrigger>
                <TabsTrigger value="images">Gambar Situs</TabsTrigger>
            </TabsList>
             <TabsContent value="general">
              {isLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className={formSectionClass}>
                    <FormField control={form.control} name="schoolName" render={({ field }) => (<FormItem><FormLabel>Nama Sekolah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Alamat</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Nomor Telepon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="announcementText" render={({ field }) => (<FormItem><FormLabel>Teks Pengumuman Banner</FormLabel><FormControl><Input {...field} placeholder="Contoh: Pendaftaran siswa baru telah dibuka!" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="announcementLink" render={({ field }) => (<FormItem><FormLabel>Link Pengumuman Banner</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                </div>
              )}
             </TabsContent>
             <TabsContent value="home">
                 {isLoading ? <Skeleton className="h-96 w-full" /> : (
                    <div className={formSectionClass}>
                        <FormField control={form.control} name="heroHeadline" render={({ field }) => (<FormItem><FormLabel>Judul Hero</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="heroSubheadline" render={({ field }) => (<FormItem><FormLabel>Sub-judul Hero</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="aboutPreview" render={({ field }) => (<FormItem><FormLabel>Pratinjau Tentang Kami</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="statsStudents" render={({ field }) => (<FormItem><FormLabel>Jumlah Siswa</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="statsTeachers" render={({ field }) => (<FormItem><FormLabel>Jumlah Guru</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="statsGraduationRate" render={({ field }) => (<FormItem><FormLabel>Tingkat Kelulusan (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                 )}
             </TabsContent>
             <TabsContent value="about">
                {isLoading ? <Skeleton className="h-96 w-full" /> : (
                    <div className={formSectionClass}>
                        <FormField control={form.control} name="vision" render={({ field }) => (<FormItem><FormLabel>Visi Sekolah</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div>
                            <FormLabel>Poin Misi</FormLabel>
                            <div className="space-y-2 mt-2">
                            {missionFields.map((field, index) => (
                                <FormField
                                key={field.id}
                                control={form.control}
                                name={`missionPoints.${index}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormControl><Input {...field} placeholder={`Poin misi #${index + 1}`} /></FormControl>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeMission(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendMission({ text: "" })}><PlusCircle className="mr-2 h-4 w-4" />Tambah Misi</Button>
                        </div>
                    </div>
                )}
             </TabsContent>
            <TabsContent value="admissions">
                {isLoading ? <Skeleton className="h-96 w-full" /> : (
                    <div className={formSectionClass}>
                        <div>
                            <FormLabel>Persyaratan Pendaftaran</FormLabel>
                            <div className="space-y-2 mt-2">
                            {requirementFields.map((field, index) => (
                                <FormField key={field.id} control={form.control} name={`admissionRequirements.${index}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormControl><Input {...field} placeholder={`Persyaratan #${index + 1}`} /></FormControl>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeRequirement(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div><FormMessage /></FormItem>
                                )}/>
                            ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendRequirement({ text: "" })}><PlusCircle className="mr-2 h-4 w-4" />Tambah Persyaratan</Button>
                        </div>
                        <div className="pt-4">
                            <FormLabel>Pertanyaan Umum (FAQ)</FormLabel>
                            <div className="space-y-4 mt-2">
                            {faqFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                                    <FormField control={form.control} name={`admissionFaqs.${index}.question`}
                                    render={({ field }) => (<FormItem><FormLabel>Pertanyaan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`admissionFaqs.${index}.answer`}
                                    render={({ field }) => (<FormItem><FormLabel>Jawaban</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeFaq(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFaq({ question: "", answer: "" })}><PlusCircle className="mr-2 h-4 w-4" />Tambah FAQ</Button>
                        </div>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="images">
              {isLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className={formSectionClass}>
                    <p className="text-sm text-muted-foreground">Kelola gambar utama yang ditampilkan di berbagai halaman. Kosongkan untuk menggunakan gambar placeholder bawaan.</p>
                    <FormField control={form.control} name="heroImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Hero Halaman Utama</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="aboutPreviewImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Pratinjau "Tentang Kami"</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="aboutHeroImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Hero Halaman "Tentang Kami"</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="programsHeroImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Hero Halaman "Program"</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="admissionsHeroImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Hero Halaman "Penerimaan"</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="newsHeroImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Hero Halaman "Berita"</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="galleryHeroImageUrl" render={({ field }) => (<FormItem><FormLabel>Gambar Hero Halaman "Galeri"</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>)} />
                </div>
              )}
             </TabsContent>
         </Tabs>
        <Button type="submit" disabled={isPending} className="mt-8">
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Semua Perubahan'}
        </Button>
        </form>
       </Form>
      </CardContent>
    </Card>
  )
}
