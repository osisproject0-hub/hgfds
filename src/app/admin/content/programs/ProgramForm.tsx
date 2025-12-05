
"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import type { Program } from "./page"

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama program harus memiliki setidaknya 2 karakter." }),
  description: z.string().min(10, { message: "Deskripsi harus memiliki setidaknya 10 karakter." }),
  careerProspects: z.string().min(10, { message: "Prospek karir harus memiliki setidaknya 10 karakter." }),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }),
  icon: z.string().min(2, { message: "Nama ikon harus memiliki setidaknya 2 karakter." }),
})

interface ProgramFormProps {
  program: Program | null;
  onSave: () => void;
}

export function ProgramForm({ program, onSave }: ProgramFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: program || {
      name: "",
      description: "",
      careerProspects: "",
      imageUrl: "https://picsum.photos/seed/program/600/400",
      icon: "Wrench",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!firestore) return

      try {
        if (program?.id) {
          const docRef = doc(firestore, "vocationalPrograms", program.id)
          await setDocumentNonBlocking(docRef, values, { merge: true })
          toast({ title: "Berhasil", description: "Program berhasil diperbarui." })
        } else {
          const colRef = collection(firestore, "vocationalPrograms")
          await addDocumentNonBlocking(colRef, values)
          toast({ title: "Berhasil", description: "Program baru telah ditambahkan." })
        }
        onSave()
      } catch (error) {
        console.error("Error saving program:", error)
        toast({
          variant: "destructive",
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan. Silakan coba lagi.",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Program</FormLabel>
              <FormControl>
                <Input placeholder="cth. Teknik Komputer & Jaringan" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi singkat tentang program..." {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="careerProspects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prospek Karir</FormLabel>
              <FormControl>
                <Textarea placeholder="cth. Teknisi Jaringan, Administrator Sistem..." {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Ikon</FormLabel>
              <FormControl>
                <Input placeholder="cth. Computer, Wrench, Camera" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Nama ikon dari <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
        </Button>
      </form>
    </Form>
  )
}
