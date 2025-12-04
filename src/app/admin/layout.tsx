"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookHeart, LogOut } from 'lucide-react'
import { adminNavLinks } from "@/lib/placeholder-data"
import { Button } from "@/components/ui/button"
import AdminHeader from "@/components/admin/AdminHeader"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login')
    }
  }, [isUserLoading, user, router])


  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
      })
    }
  }
  
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex h-full flex-col">
          <SidebarHeader>
            <Link href="/admin" className="flex items-center gap-2" prefetch={false}>
              <BookHeart className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                Admin Panel
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {adminNavLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))}
                    tooltip={{
                      children: link.label,
                      side: 'right',
                    }}
                  >
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/admin/100/100"} alt="Admin" />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm">{user?.displayName || 'Admin User'}</span>
                <span className="text-xs text-sidebar-foreground/70">{user?.email}</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden" onClick={handleLogout}>
                <LogOut />
              </Button>
            </div>
          </SidebarFooter>
        </div>
      </Sidebar>
      <div className="flex-1">
        <AdminHeader />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}
