
"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, PlusCircle, Trash2 } from "lucide-react"
import { useFirestore, useDoc, setDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  schoolName: z.string().min(5, { message: "Nama sekolah harus memiliki setidaknya 5 karakter." }),
  address: z.string().min(10, { message: "Alamat harus memiliki setidaknya 10 karakter." }),
  phone: z.string().min(10, { message: "Nomor telepon harus valid." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  vision: z.string().min(10, { message: "Visi harus memiliki setidaknya 10 karakter." }),
  missionPoints: z.array(z.object({ text: z.string().min(1, "Poin misi tidak boleh kosong.") })),
  admissionRequirements: z.array(z.object({ text: z.string().min(1, "Persyaratan tidak boleh kosong.") })),
  admissionFaqs: z.array(z.object({ 
      question: z.string().min(1, "Pertanyaan tidak boleh kosong."),
      answer: z.string().min(1, "Jawaban tidak boleh kosong."),
  })),
  heroHeadline: z.string().min(10, { message: "Judul hero harus memiliki setidaknya 10 karakter." }),
  heroSubheadline: z.string().min(20, { message: "Sub-judul hero harus memiliki setidaknya 20 karakter." }),
  aboutPreview: z.string().min(20, { message: "Teks pratinjau harus memiliki setidaknya 20 karakter." }),
  statsStudents: z.coerce.number().min(0, "Jumlah siswa tidak boleh negatif."),
  statsTeachers: z.coerce.number().min(0, "Jumlah guru tidak boleh negatif."),
  statsGraduationRate: z.coerce.number().min(0).max(100, "Tingkat kelulusan harus antara 0 dan 100."),
  announcementText: z.string().optional(),
  announcementLink: z.string().url({ message: "URL tidak valid." }).optional().or(z.literal('')),
})

export type SiteSettings = z.infer<typeof formSchema>;

export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "siteSettings", "main");
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsDocRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: settings || {
      schoolName: "",
      address: "",
      phone: "",
      email: "",
      vision: "",
      missionPoints: [],
      admissionRequirements: [],
      admissionFaqs: [],
      heroHeadline: "",
      heroSubheadline: "",
      aboutPreview: "",
      statsStudents: 0,
      statsTeachers: 0,
      statsGraduationRate: 0,
      announcementText: "",
      announcementLink: "",
    }
  })

  const { fields: missionFields, append: appendMission, remove: removeMission } = useFieldArray({
    control: form.control,
    name: "missionPoints"
  });
  
  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({
    control: form.control,
    name: "admissionRequirements"
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "admissionFaqs"
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Situs</CardTitle>
        <CardDescription>
          Kelola informasi dan konten umum yang ditampilkan di seluruh situs web Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <Tabs defaultValue="general">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="general">Umum</TabsTrigger>
                    <TabsTrigger value="homepage">Halaman Depan</TabsTrigger>
                    <TabsTrigger value="about">Tentang Kami</TabsTrigger>
                    <TabsTrigger value="admissions">Penerimaan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="space-y-6 max-w-2xl">
                     <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Sekolah</FormLabel>
                            <FormControl>
                              <Input placeholder="cth. SMK LPPMRI 2 Kedungreja" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alamat</FormLabel>
                            <FormControl>
                              <Input placeholder="cth. Jl. Raya Kedungreja No.1" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input placeholder="cth. (123) 456-7890" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="cth. info@sekolah.sch.id" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="announcementText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teks Pengumuman</FormLabel>
                            <FormControl>
                              <Input placeholder="Teks untuk banner pengumuman" {...field} disabled={isPending} />
                            </FormControl>
                             <FormDescription>Teks yang ditampilkan di banner atas. Kosongkan untuk menyembunyikan.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="announcementLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tautan Pengumuman</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/link" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </TabsContent>
                   <TabsContent value="homepage" className="space-y-6 max-w-2xl">
                       <FormField
                        control={form.control}
                        name="heroHeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Judul Utama Hero</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Judul utama di halaman depan" {...field} disabled={isPending} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="heroSubheadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub-Judul Hero</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Sub-judul di halaman depan" {...field} disabled={isPending} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="aboutPreview"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pratinjau "Tentang Kami"</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Teks singkat tentang sekolah untuk halaman depan" {...field} disabled={isPending} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="statsStudents"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jumlah Siswa</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="statsTeachers"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jumlah Guru</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="statsGraduationRate"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tingkat Kelulusan (%)</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>
                   </TabsContent>
                  <TabsContent value="about" className="space-y-6 max-w-2xl">
                     <FormField
                        control={form.control}
                        name="vision"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visi Sekolah</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tuliskan visi sekolah..." {...field} disabled={isPending} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <FormLabel>Poin-Poin Misi</FormLabel>
                        <div className="space-y-2 mt-2">
                          {missionFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                              <FormField
                                control={form.control}
                                name={`missionPoints.${index}.text`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input {...field} placeholder={`Poin misi #${index + 1}`} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="button" variant="destructive" size="icon" onClick={() => removeMission(index)} disabled={isPending}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendMission({ text: "" })}>
                           <PlusCircle className="mr-2 h-4 w-4" /> Tambah Poin Misi
                        </Button>
                      </div>
                  </TabsContent>
                  <TabsContent value="admissions" className="space-y-6 max-w-2xl">
                     <div>
                        <FormLabel>Persyaratan Pendaftaran</FormLabel>
                        <div className="space-y-2 mt-2">
                          {reqFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                              <FormField
                                control={form.control}
                                name={`admissionRequirements.${index}.text`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input {...field} placeholder={`Persyaratan #${index + 1}`} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="button" variant="destructive" size="icon" onClick={() => removeReq(index)} disabled={isPending}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendReq({ text: "" })}>
                           <PlusCircle className="mr-2 h-4 w-4" /> Tambah Persyaratan
                        </Button>
                      </div>

                       <div>
                        <FormLabel>Pertanyaan Umum (FAQ)</FormLabel>
                        <div className="space-y-4 mt-2">
                          {faqFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-md space-y-2">
                              <div className="flex justify-end">
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFaq(index)} disabled={isPending}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <FormField
                                control={form.control}
                                name={`admissionFaqs.${index}.question`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Pertanyaan</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Tulis pertanyaan..." disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                               <FormField
                                control={form.control}
                                name={`admissionFaqs.${index}.answer`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Jawaban</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} placeholder="Tulis jawaban..." disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFaq({ question: "", answer: "" })}>
                           <PlusCircle className="mr-2 h-4 w-4" /> Tambah FAQ
                        </Button>
                      </div>

                  </TabsContent>
               </Tabs>
               <Button type="submit" disabled={isPending} className="mt-8">
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
                </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

    