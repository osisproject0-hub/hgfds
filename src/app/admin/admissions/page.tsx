// This is a new file
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore"
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

export default function AdminAdmissionsPage() {
  const firestore = useFirestore()
  const applicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "applications"),
      orderBy("applicationDate", "desc")
    )
  }, [firestore])

  const { data: applications, isLoading } = useCollection(applicationsQuery)

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    if (!firestore) return;
    const appRef = doc(firestore, "applications", id);
    try {
      await updateDoc(appRef, { status: status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Applications</CardTitle>
        <CardDescription>
          View and manage all student applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading applications...</TableCell>
              </TableRow>
            )}
            {applications && applications.length > 0 ? applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.firstName} {app.lastName}</TableCell>
                <TableCell>{app.programId}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[app.status as ApplicationStatus] ?? 'default'} className="capitalize">{app.status}</Badge>
                </TableCell>
                <TableCell>{app.applicationDate ? format(new Date(app.applicationDate.seconds * 1000), "yyyy-MM-dd") : 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.keys(statusVariant).map((status) => (
                        <DropdownMenuItem key={status} onSelect={() => handleStatusChange(app.id, status as ApplicationStatus)}>
                          Mark as {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No applications found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
