
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser as useAuthUser } from "@/firebase"

type UserRole = 'Super Admin' | 'Admin' | 'User';

export type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  role: UserRole;
}

const roles: UserRole[] = ['Super Admin', 'Admin', 'User'];

export default function AdminUsersPage() {
  const firestore = useFirestore()
  const { toast } = useToast()
  const { user: currentUser } = useAuthUser();
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "users")
    )
  }, [firestore])

  const { data: users, isLoading } = useCollection<User>(usersQuery)
  
  const currentUserData = React.useMemo(() => users?.find(u => u.id === currentUser?.uid), [users, currentUser]);

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

    if (currentUserData?.role !== 'Super Admin' && newRole === 'Super Admin') {
        toast({
            variant: "destructive",
            title: "Akses Ditolak",
            description: "Hanya Super Admin yang dapat menetapkan peran Super Admin.",
        });
        return;
    }

    const userDocRef = doc(firestore, "users", userId);
    await updateDocumentNonBlocking(userDocRef, { role: newRole });
    toast({
      title: "Peran Diperbarui",
      description: `Peran pengguna telah berhasil diubah menjadi ${newRole}.`,
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", userId);
    await deleteDocumentNonBlocking(userDocRef);
    toast({
      title: "Pengguna Dihapus",
      description: "Pengguna telah berhasil dihapus dari sistem.",
    });
    setUserToDelete(null);
  };

  const isSuperAdmin = currentUserData?.role === 'Super Admin';

  const canEdit = (targetUser: User) => {
    if (!currentUserData) return false;
    // Cannot edit self
    if (targetUser.id === currentUserData.id) return false;
    // Super Admin can edit anyone
    if (isSuperAdmin) return true;
    // Admin cannot edit Super Admins or other Admins
    if (targetUser.role === 'Super Admin' || targetUser.role === 'Admin') return false;
    return true;
  }
  
  const canDelete = (targetUser: User) => {
    if (!currentUserData) return false;
     // Cannot delete self
    if (targetUser.id === currentUserData.id) return false;
    // Super Admin can delete anyone except themself
    if (isSuperAdmin) return true;
    // Admins can only delete Users
    if (currentUserData.role === 'Admin' && targetUser.role === 'User') return true;

    return false;
  }

  return (
    <>
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
              <TableRow key={user.id} className={user.id === currentUser?.uid ? 'bg-muted/50' : ''}>
                <TableCell className="flex items-center gap-4">
                   <Avatar>
                        {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.displayName || 'No Name'} {user.id === currentUser?.uid && '(Anda)'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={user.role === 'Admin' || user.role === 'Super Admin' ? 'destructive' : 'secondary'}>{user.role || 'User'}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={!canEdit(user) && !canDelete(user)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {canEdit(user) && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Ubah Peran</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                  {roles.map((role) => (
                                    <DropdownMenuItem 
                                      key={role}
                                      disabled={(role === 'Super Admin' && !isSuperAdmin) || user.role === role}
                                      onSelect={() => handleRoleChange(user.id, role)}
                                    >
                                      Jadikan {role}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        )}
                        {canEdit(user) && canDelete(user) && <DropdownMenuSeparator />}
                        {canDelete(user) && (
                          <DropdownMenuItem onSelect={() => setUserToDelete(user)} className="text-red-600">
                            Hapus Pengguna
                          </DropdownMenuItem>
                        )}
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
     <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengguna <span className="font-semibold">{userToDelete?.displayName || userToDelete?.email}</span> secara permanen dari database.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}>Lanjutkan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
