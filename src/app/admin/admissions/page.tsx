
"use client"

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
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

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
  
  const programMap = useMemoFirebase(() => {
    if (!programs) return new Map();
    return new Map(programs.map(p => [p.id, p.name]));
  }, [programs]);


  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    if (!firestore) return;
    const appRef = doc(firestore, "applications", id);
    updateDocumentNonBlocking(appRef, { status: status });
  }
  
  const isLoading = isLoadingApps || isLoadingPrograms;

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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Memuat pendaftaran...</TableCell>
              </TableRow>
            )}
            {applications && applications.length > 0 ? applications.map((app) => (
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
                      {Object.keys(statusVariant).map((status) => (
                        <DropdownMenuItem key={status} onSelect={() => handleStatusChange(app.id, status as ApplicationStatus)}>
                          Tandai sebagai {statusLabels[status as ApplicationStatus]}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Tidak ada pendaftaran ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
