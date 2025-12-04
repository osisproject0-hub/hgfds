
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { format } from "date-fns"
import { useMemo } from "react"

const statusVariant = {
    pending: "default",
    reviewed: "secondary",
    accepted: "outline",
    rejected: "destructive",
} as const;

type ApplicationStatus = keyof typeof statusVariant;

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Menunggu",
  reviewed: "Ditinjau",
  accepted: "Diterima",
  rejected: "Ditolak",
};

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

export default function RecentApplications() {
  const firestore = useFirestore()

  const applicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "applications"),
      orderBy("applicationDate", "desc"),
      limit(5)
    )
  }, [firestore])

  const programsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "vocationalPrograms"))
  }, [firestore])

  const { data: applications, isLoading: isLoadingApps } = useCollection<Application>(applicationsQuery)
  const { data: programs, isLoading: isLoadingPrograms } = useCollection<Program>(programsQuery)

  const programMap = useMemo(() => {
    if (!programs) return new Map();
    return new Map(programs.map(p => [p.id, p.name]));
  }, [programs]);
  
  const isLoading = isLoadingApps || isLoadingPrograms;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Pendaftaran Terbaru</CardTitle>
            <CardDescription>
                Ringkasan pendaftaran siswa terbaru.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/admin/admissions">
                Lihat Semua
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pendaftar</TableHead>
              <TableHead>Program</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Memuat pendaftaran...</TableCell>
              </TableRow>
            )}
            {applications && applications.length > 0 ? applications.map((app) => (
                <TableRow key={app.id}>
                    <TableCell>
                        <div className="font-medium">{app.firstName} {app.lastName}</div>
                    </TableCell>
                    <TableCell>{programMap.get(app.programId) || app.programId}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={statusVariant[app.status] ?? 'default'} className="capitalize">{statusLabels[app.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {app.applicationDate ? format(new Date(app.applicationDate.seconds * 1000), "yyyy-MM-dd") : 'N/A'}
                    </TableCell>
                </TableRow>
            )) : !isLoading && (
              <TableRow>
                  <TableCell colSpan={4} className="text-center">Tidak ada pendaftaran terbaru ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
