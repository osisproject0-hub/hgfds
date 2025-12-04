
"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookHeart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        toast({
          title: "Login Berhasil",
          description: "Mengarahkan Anda ke dasbor admin.",
        })
        router.push("/admin")
      } catch (error: any) {
        console.error("Login gagal:", error)
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Silakan periksa kredensial Anda dan coba lagi.",
        })
      }
    })
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Login Admin</h1>
            <p className="text-balance text-muted-foreground">
              Masukkan email Anda di bawah ini untuk masuk ke akun Anda
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...</> : 'Login'}
              </Button>
               <div className="mt-4 text-center text-sm">
                Belum punya akun?{" "}
                <Link href="/signup" className="underline">
                  Daftar
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-primary lg:flex lg:items-center lg:justify-center lg:flex-col lg:text-center p-12">
         <BookHeart className="h-24 w-24 text-primary-foreground mb-4" />
          <h2 className="text-4xl font-headline font-bold text-primary-foreground">SMK LPPMRI 2 Kedungreja</h2>
          <p className="text-lg text-primary-foreground/80 mt-2">Panel Kontrol Admin</p>
      </div>
    </div>
  )
}
