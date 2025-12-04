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

const statusVariant = {
    pending: "default",
    reviewed: "secondary",
    accepted: "outline",
    rejected: "destructive",
} as const;


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

  const { data: applications, isLoading } = useCollection(applicationsQuery)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
                An overview of the latest student applications.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/admin/admissions">
                View All
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Program</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading applications...</TableCell>
              </TableRow>
            )}
            {applications && applications.length > 0 ? applications.map((app) => (
                <TableRow key={app.id}>
                    <TableCell>
                        <div className="font-medium">{app.firstName} {app.lastName}</div>
                    </TableCell>
                    <TableCell>{app.programId}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={statusVariant[app.status as keyof typeof statusVariant] ?? 'default'} className="capitalize">{app.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {app.applicationDate ? format(new Date(app.applicationDate.seconds * 1000), "yyyy-MM-dd") : 'N/A'}
                    </TableCell>
                </TableRow>
            )) : !isLoading && (
              <TableRow>
                  <TableCell colSpan={4} className="text-center">No recent applications found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
