
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
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const statusVariant = {
    pending: "default",
    reviewed: "secondary",
    accepted: "outline",
    rejected: "destructive",
} as const;

type ApplicationStatus = keyof typeof statusVariant;

type Application = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  programId: string;
  status: ApplicationStatus;
  applicationDate: any;
}

type Program = {
  id: string;
  name: string;
}

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Menunggu",
  reviewed: "Ditinjau",
  accepted: "Diterima",
  rejected: "Ditolak",
};


export default function AdminAdmissionsPage() {
  const firestore = useFirestore()
  const { toast } = useToast()

  const applicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "applications"),
      orderBy("applicationDate", "desc")
    )
  }, [firestore])

  const programsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "vocationalPrograms"))
  }, [firestore])

  const { data: applications, isLoading: isLoadingApps } = useCollection<Application>(applicationsQuery)
  const { data: programs, isLoading: isLoadingPrograms } = useCollection<Program>(programsQuery)
  
  const programMap = React.useMemo(() => {
    if (!programs) return new Map();
    return new Map(programs.map(p => [p.id, p.name]));
  }, [programs]);


  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    if (!firestore) return;
    const appRef = doc(firestore, "applications", id);
    updateDocumentNonBlocking(appRef, { status: status });
    toast({ title: "Status Diperbarui", description: "Status pendaftaran telah berhasil diubah." })
  }

  const handleDelete = (id: string) => {
    if (!firestore) return;
    const appRef = doc(firestore, "applications", id);
    deleteDocumentNonBlocking(appRef)
    toast({ title: "Pendaftaran Dihapus", description: "Pendaftaran telah berhasil dihapus." })
  }

  const isLoading = isLoadingApps || isLoadingPrograms;

  const TableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center">Memuat pendaftaran...</TableCell>
        </TableRow>
      )
    }
    if (applications && applications.length > 0) {
      return applications.map((app) => (
        <TableRow key={app.id}>
          <TableCell className="font-medium">{app.firstName} {app.lastName}</TableCell>
          <TableCell>{programMap.get(app.programId) || app.programId}</TableCell>
          <TableCell>
            <Badge variant={statusVariant[app.status] ?? 'default'} className="capitalize">{statusLabels[app.status]}</Badge>
          </TableCell>
          <TableCell>{app.applicationDate ? format(new Date(app.applicationDate.seconds * 1000), "yyyy-MM-dd") : 'N/A'}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
                {Object.keys(statusVariant).map((status) => (
                  <DropdownMenuItem key={status} onSelect={() => handleStatusChange(app.id, status as ApplicationStatus)}>
                    Tandai sebagai {statusLabels[status as ApplicationStatus]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Hapus</DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                          <AlertDialogDescription>
                              Tindakan ini tidak dapat diurungkan. Pendaftaran untuk <span className="font-semibold">{app.firstName} {app.lastName}</span> akan dihapus secara permanen.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(app.id)}>Lanjutkan</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))
    }
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">Tidak ada pendaftaran ditemukan.</TableCell>
      </TableRow>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semua Pendaftaran</CardTitle>
        <CardDescription>
          Lihat dan kelola semua pendaftaran siswa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pendaftar</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableContent />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
