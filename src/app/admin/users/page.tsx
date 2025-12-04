
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'Admin' | 'User';
}

export default function AdminUsersPage() {
  const firestore = useFirestore()
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "users")
    )
  }, [firestore])

  const { data: users, isLoading } = useCollection<User>(usersQuery)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengguna</CardTitle>
        <CardDescription>
          Daftar semua pengguna yang terdaftar di sistem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Memuat pengguna...</TableCell>
              </TableRow>
            )}
            {users && users.length > 0 ? users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-4">
                   <Avatar>
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.displayName || 'No Name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    {/* Future actions like edit/delete can be added here */}
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Tidak ada pengguna ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

    