
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
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, query, doc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { useUser as useAuthUser } from "@/firebase"

type UserRole = 'Admin' | 'User' | 'Super Admin';

type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  role: UserRole;
}

const roles: UserRole[] = ['Admin', 'User'];

export default function AdminUsersPage() {
  const firestore = useFirestore()
  const { toast } = useToast()
  const { user: currentUser } = useAuthUser();
  
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

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", userId);
    try {
      await updateDocumentNonBlocking(userDocRef, { role: newRole });
      toast({
        title: "Peran Diperbarui",
        description: `Peran pengguna telah berhasil diubah menjadi ${newRole}.`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Peran",
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", userId);
    try {
      await deleteDocumentNonBlocking(userDocRef);
      toast({
        title: "Pengguna Dihapus",
        description: "Pengguna telah berhasil dihapus dari sistem.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menghapus Pengguna",
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

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
                        {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.displayName || 'No Name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={user.role === 'Admin' || user.role === 'Super Admin' ? 'default' : 'secondary'}>{user.role || 'User'}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={user.id === currentUser?.uid}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {roles.map((role) => (
                          <DropdownMenuItem 
                            key={role}
                            disabled={user.role === role}
                            onSelect={() => handleRoleChange(user.id, role)}
                          >
                            Jadikan {role}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengguna <span className="font-semibold">{user.displayName || user.email}</span> secara permanen dari database.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Lanjutkan</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
