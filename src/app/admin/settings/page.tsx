
"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Loader2 } from "lucide-react"
import { useFirestore, useDoc, setDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  schoolName: z.string().min(5, { message: "Nama sekolah harus memiliki setidaknya 5 karakter." }),
  address: z.string().min(10, { message: "Alamat harus memiliki setidaknya 10 karakter." }),
  phone: z.string().min(10, { message: "Nomor telepon harus valid." }),
  email: z.string().email({ message: "Format email tidak valid." }),
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
    }
  })

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
          Kelola informasi umum yang ditampilkan di seluruh situs web Anda.
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
