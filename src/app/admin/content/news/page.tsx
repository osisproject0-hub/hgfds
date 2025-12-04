
"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase"
import { collection, query, doc, orderBy } from "firebase/firestore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { NewsArticleForm } from "./NewsArticleForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"

export type NewsArticle = {
  id?: string;
  title: string;
  content: string;
  author: string;
  publicationDate: any; // Firestore timestamp
  imageUrl: string;
}

export default function NewsTab() {
  const firestore = useFirestore()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null)

  const articlesQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "newsArticles"), orderBy("publicationDate", "desc"))
  }, [firestore])

  const { data: articles, isLoading } = useCollection<NewsArticle>(articlesQuery)

  const handleAdd = () => {
    setSelectedArticle(null)
    setIsFormOpen(true)
  }

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsFormOpen(true)
  }

  const handleDelete = async (articleId: string) => {
    if (!firestore) return
    const docRef = doc(firestore, "newsArticles", articleId)
    await deleteDocumentNonBlocking(docRef)
    toast({ title: "Artikel Dihapus", description: "Artikel berita telah berhasil dihapus." })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Artikel
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Tanggal Publikasi</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading...</TableCell>
              </TableRow>
            )}
            {articles && articles.length > 0 ? articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                  {article.publicationDate ? format(new Date(article.publicationDate.seconds * 1000), "dd MMMM yyyy") : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(article)}>Edit</DropdownMenuItem>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus artikel berita secara permanen.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => article.id && handleDelete(article.id)}>Lanjutkan</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
               <TableRow>
                <TableCell colSpan={3} className="text-center">Belum ada artikel berita.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedArticle ? "Edit Artikel" : "Tambah Artikel Baru"}</DialogTitle>
            <DialogDescription>
              {selectedArticle ? "Ubah detail artikel dan simpan." : "Isi detail untuk artikel berita baru."}
            </DialogDescription>
          </DialogHeader>
          <NewsArticleForm article={selectedArticle} onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
