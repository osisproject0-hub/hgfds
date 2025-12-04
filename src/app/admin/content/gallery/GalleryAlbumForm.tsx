
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, PlusCircle, Trash2 } from "lucide-react"
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import type { GalleryAlbum } from "./page"

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama album harus memiliki setidaknya 2 karakter." }),
  description: z.string().min(5, { message: "Deskripsi harus memiliki setidaknya 5 karakter." }),
  imageUrls: z.array(z.object({ value: z.string().url({ message: "URL gambar tidak valid." }) })),
})

interface GalleryAlbumFormProps {
  album: GalleryAlbum | null;
  onSave: () => void;
}

export function GalleryAlbumForm({ album, onSave }: GalleryAlbumFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: album?.name || "",
        description: album?.description || "",
        imageUrls: album?.imageUrls ? album.imageUrls.map(url => ({ value: url })) : [{ value: "https://picsum.photos/seed/gallery/600/400" }]
    },
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls"
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!firestore) return

      const dataToSave = {
          ...values,
          imageUrls: values.imageUrls.map(urlObj => urlObj.value), // transform back to array of strings
      }

      try {
        if (album?.id) {
          const docRef = doc(firestore, "galleryAlbums", album.id)
          await setDocumentNonBlocking(docRef, dataToSave, { merge: true })
          toast({ title: "Berhasil", description: "Album berhasil diperbarui." })
        } else {
          const colRef = collection(firestore, "galleryAlbums")
          await addDocumentNonBlocking(colRef, dataToSave)
          toast({ title: "Berhasil", description: "Album baru telah ditambahkan." })
        }
        onSave()
      } catch (error) {
        console.error("Error saving album:", error)
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
              <FormLabel>Nama Album</FormLabel>
              <FormControl>
                <Input placeholder="cth. Kegiatan Belajar Mengajar" {...field} disabled={isPending} />
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
                <Textarea placeholder="Deskripsi singkat tentang album..." {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <FormLabel>URL Gambar</FormLabel>
            <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
                <FormField
                key={field.id}
                control={form.control}
                name={`imageUrls.${index}.value`}
                render={({ field }) => (
                    <FormItem>
                    <div className="flex items-center gap-2">
                        <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" disabled={isPending} />
                        </FormControl>
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={isPending || fields.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ))}
            </div>
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Gambar
            </Button>
        </div>
        
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
        </Button>
      </form>
    </Form>
  )
}
