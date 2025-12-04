
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
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
  
  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  }

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={2} className="text-center">Memuat pengguna...</TableCell>
              </TableRow>
            )}
            {users && users.length > 0 ? users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-4">
                   <Avatar>
                        {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.displayName || 'No Name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role || 'User'}</Badge>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={2} className="text-center">Tidak ada pengguna ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
