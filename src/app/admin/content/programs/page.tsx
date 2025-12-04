
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
import { ProgramForm } from "./ProgramForm"
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

export type Program = {
  id?: string;
  name: string;
  description: string;
  careerProspects: string;
  imageUrl: string;
  icon: string;
}

export default function ProgramsTab() {
  const firestore = useFirestore()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedProgram, setSelectedProgram] = React.useState<Program | null>(null)

  const programsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "vocationalPrograms"))
  }, [firestore])

  const { data: programs, isLoading } = useCollection<Program>(programsQuery)

  const handleAdd = () => {
    setSelectedProgram(null)
    setIsFormOpen(true)
  }

  const handleEdit = (program: Program) => {
    setSelectedProgram(program)
    setIsFormOpen(true)
  }

  const handleDelete = async (programId: string) => {
    if (!firestore) return
    const docRef = doc(firestore, "vocationalPrograms", programId)
    await deleteDocumentNonBlocking(docRef)
    toast({ title: "Program Dihapus", description: "Program telah berhasil dihapus." })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Program
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Program</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading...</TableCell>
              </TableRow>
            )}
            {programs && programs.length > 0 ? programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell>{program.description}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(program)}>Edit</DropdownMenuItem>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus program secara permanen.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => program.id && handleDelete(program.id)}>Lanjutkan</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
               <TableRow>
                <TableCell colSpan={3} className="text-center">Belum ada program.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedProgram ? "Edit Program" : "Tambah Program Baru"}</DialogTitle>
            <DialogDescription>
              {selectedProgram ? "Ubah detail program dan simpan." : "Isi detail untuk program baru."}
            </DialogDescription>
          </DialogHeader>
          <ProgramForm program={selectedProgram} onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
