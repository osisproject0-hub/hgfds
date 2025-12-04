// This is a new file
"use client"

import { useState, useTransition } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { addDocumentNonBlocking, useFirestore } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { featuredPrograms } from "@/lib/placeholder-data"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Nama depan harus memiliki setidaknya 2 karakter." }),
  lastName: z.string().min(2, { message: "Nama belakang harus memiliki setidaknya 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  phoneNumber: z.string().min(10, { message: "Nomor telepon harus valid." }),
  programId: z.string({ required_error: "Silakan pilih program." }),
})

export default function ApplyPage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        if (!firestore) {
             toast({
                variant: "destructive",
                title: "Gagal Mengirim Pendaftaran",
                description: "Koneksi ke database gagal.",
            })
            return
        }

      try {
        const applicationsCol = collection(firestore, "applications");
        await addDocumentNonBlocking(applicationsCol, {
            ...values,
            applicationDate: serverTimestamp(),
            status: 'pending'
        })
        
        toast({
          title: "Pendaftaran Terkirim!",
          description: "Terima kasih telah mendaftar. Kami akan segera meninjau aplikasi Anda.",
        })
        form.reset()
      } catch (error) {
        console.error("Error submitting application:", error)
        toast({
          variant: "destructive",
          title: "Gagal Mengirim Pendaftaran",
          description: "Terjadi kesalahan. Silakan coba lagi nanti.",
        })
      }
    })
  }

  return (
    <>
      <div className="bg-primary">
          <div className="container mx-auto px-4 md:px-6 py-12 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground font-headline">Formulir Pendaftaran</h1>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                  Lengkapi formulir di bawah ini untuk memulai proses pendaftaran Anda di SMK LPPMRI 2 Kedungreja.
              </p>
          </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Depan</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Belakang</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="081234567890" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Keahlian</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih program keahlian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {featuredPrograms.map(program => (
                        <SelectItem key={program.title} value={program.title}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full" size="lg">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> : 'Kirim Pendaftaran'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
