
"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth, useUser } from "@/firebase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminHeader() {
  const auth = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth)
      toast({
        title: "Berhasil Keluar",
        description: "Anda telah berhasil keluar.",
      })
      router.push('/login')
    } catch (error) {
      console.error("Gagal keluar:", error)
      toast({
        variant: "destructive",
        title: "Gagal Keluar",
        description: "Terjadi kesalahan saat keluar. Silakan coba lagi.",
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dasbor</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari..."
          className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
             <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/admin/100/100"} alt="Admin" />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => router.push('/admin/settings')}>Pengaturan</DropdownMenuItem>
          <DropdownMenuItem>Bantuan</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>
             Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
