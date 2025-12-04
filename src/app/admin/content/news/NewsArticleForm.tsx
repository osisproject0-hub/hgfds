
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useFirestore, useUser, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import type { NewsArticle } from "./page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const newsCategories = ["Berita", "Pengumuman", "Acara"] as const;

const formSchema = z.object({
  title: z.string().min(5, { message: "Judul harus memiliki setidaknya 5 karakter." }),
  content: z.string().min(20, { message: "Konten harus memiliki setidaknya 20 karakter." }),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }),
  category: z.enum(newsCategories),
})

interface NewsArticleFormProps {
  article: NewsArticle | null;
  onSave: () => void;
}

export function NewsArticleForm({ article, onSave }: NewsArticleFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: article ? {
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl,
        category: article.category,
    } : {
      title: "",
      content: "",
      imageUrl: "https://picsum.photos/seed/news/800/600",
      category: "Berita",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!firestore || !user) return

      try {
        const dataToSave = {
            ...values,
            author: user.displayName || user.email || "Admin",
            publicationDate: serverTimestamp(),
        }

        if (article?.id) {
          const docRef = doc(firestore, "newsArticles", article.id)
          // Don't overwrite publicationDate on edit
          const { publicationDate, ...updateData } = dataToSave
          await setDocumentNonBlocking(docRef, updateData, { merge: true })
          toast({ title: "Berhasil", description: "Artikel berhasil diperbarui." })
        } else {
          const colRef = collection(firestore, "newsArticles")
          await addDocumentNonBlocking(colRef, dataToSave)
          toast({ title: "Berhasil", description: "Artikel baru telah dipublikasikan." })
        }
        onSave()
      } catch (error) {
        console.error("Error saving article:", error)
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Artikel</FormLabel>
              <FormControl>
                <Input placeholder="Judul berita atau acara" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {newsCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten</FormLabel>
              <FormControl>
                <Textarea placeholder="Tulis isi artikel di sini..." {...field} disabled={isPending} rows={8} />
              </FormControl>
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
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan & Publikasikan'}
        </Button>
      </form>
    </Form>
  )
}
