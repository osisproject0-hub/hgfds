
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useToast } from "@/hooks/use-toast"


type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: any;
}

export default function AdminMessagesPage() {
  const firestore = useFirestore()
  const { toast } = useToast()

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "contactMessages"),
      orderBy("submittedAt", "desc")
    )
  }, [firestore])

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery)
  
  const handleDelete = async (messageId: string) => {
    if (!firestore) return
    const docRef = doc(firestore, "contactMessages", messageId)
    await deleteDocumentNonBlocking(docRef)
    toast({ title: "Pesan Dihapus", description: "Pesan telah berhasil dihapus." })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesan Masuk</CardTitle>
        <CardDescription>
          Lihat semua pesan yang dikirim melalui formulir kontak website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengirim</TableHead>
              <TableHead>Subjek</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Memuat pesan...</TableCell>
              </TableRow>
            )}
            {messages && messages.length > 0 ? messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>
                    <div className="font-medium">{msg.name}</div>
                    <div className="text-sm text-muted-foreground">{msg.email}</div>
                </TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell>{msg.submittedAt ? format(new Date(msg.submittedAt.seconds * 1000), "yyyy-MM-dd HH:mm") : 'N/A'}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak bisa diurungkan. Pesan dari <span className="font-semibold">{msg.name}</span> akan dihapus secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(msg.id)}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Tidak ada pesan ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
