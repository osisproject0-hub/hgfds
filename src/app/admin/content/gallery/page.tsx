
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
import { collection, query, doc } from "firebase/firestore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { GalleryAlbumForm } from "./GalleryAlbumForm"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type GalleryAlbum = {
  id?: string;
  name: string;
  description: string;
  imageUrls: string[];
  videoUrls?: string[];
}

export default function GalleryTab() {
  const firestore = useFirestore()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedAlbum, setSelectedAlbum] = React.useState<GalleryAlbum | null>(null)

  const albumsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "galleryAlbums"))
  }, [firestore])

  const { data: albums, isLoading } = useCollection<GalleryAlbum>(albumsQuery)

  const handleAdd = () => {
    setSelectedAlbum(null)
    setIsFormOpen(true)
  }

  const handleEdit = (album: GalleryAlbum) => {
    setSelectedAlbum(album)
    setIsFormOpen(true)
  }

  const handleDelete = async (albumId: string) => {
    if (!firestore) return
    const docRef = doc(firestore, "galleryAlbums", albumId)
    await deleteDocumentNonBlocking(docRef)
    toast({ title: "Album Dihapus", description: "Album galeri telah berhasil dihapus." })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Album
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Album</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jumlah Gambar</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            )}
            {albums && albums.length > 0 ? albums.map((album) => (
              <TableRow key={album.id}>
                <TableCell className="font-medium">{album.name}</TableCell>
                <TableCell>{album.description}</TableCell>
                <TableCell>{album.imageUrls?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(album)}>Edit</DropdownMenuItem>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus album secara permanen.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => album.id && handleDelete(album.id)}>Lanjutkan</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
               <TableRow>
                <TableCell colSpan={4} className="text-center">Belum ada album.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAlbum ? "Edit Album" : "Tambah Album Baru"}</DialogTitle>
            <DialogDescription>
              {selectedAlbum ? "Ubah detail album dan kelola gambar." : "Isi detail untuk album galeri baru."}
            </DialogDescription>
          </DialogHeader>
          <GalleryAlbumForm album={selectedAlbum} onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
