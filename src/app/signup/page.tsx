
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
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc } from "firebase/firestore"
import Image from "next/image"

export default function AdminSignupPage() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()
  
  const auth = useAuth()
  const firestore = useFirestore()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth || !firestore) {
        toast({
            variant: "destructive",
            title: "Gagal Mendaftar",
            description: "Firebase belum diinisialisasi.",
        })
        return;
    }
    
    startTransition(async () => {
      try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 2. Update user profile in Auth
        await updateProfile(user, { displayName })

        // 3. Create user document in Firestore with a default 'Siswa' role.
        const userDocRef = doc(firestore, "users", user.uid)
        await setDocumentNonBlocking(userDocRef, {
            displayName: displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'Siswa' // Default role for new sign-ups is 'Siswa'
        }, {})

        toast({
          title: "Pendaftaran Berhasil",
          description: `Selamat datang, ${displayName}! Akun Anda telah dibuat.`,
        })
        
        // Redirect to a non-admin page or a student dashboard if it exists
        router.push("/")

      } catch (error: any) {
        console.error("Gagal mendaftar:", error)
        let description = "Terjadi kesalahan tak terduga. Silakan coba lagi."
        if (error.code === 'auth/email-already-in-use') {
          description = "Email ini sudah terdaftar. Silakan login atau gunakan email lain."
        } else if (error.code === 'auth/weak-password') {
          description = "Kata sandi terlalu lemah. Silakan gunakan setidaknya 6 karakter."
        } else if (error.message) {
          description = error.message;
        }

        toast({
          variant: "destructive",
          title: "Gagal Mendaftar",
          description: description,
        })
      }
    })
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Buat Akun</h1>
            <p className="text-balance text-muted-foreground">
              Masukkan detail Anda untuk membuat akun baru.
            </p>
          </div>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
               <div className="grid gap-2">
                <Label htmlFor="displayName">Nama Lengkap</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isPending}
                />
              </div>
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
                <Label htmlFor="password">Kata Sandi</Label>
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
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat Akun...</> : 'Daftar'}
              </Button>
              <div className="mt-4 text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-primary lg:flex lg:items-center lg:justify-center lg:flex-col lg:text-center p-12">
        <Image src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png" alt="Logo" width={96} height={96} />
        <h2 className="text-4xl font-headline font-bold text-primary-foreground mt-4">SMK LPPMRI 2 Kedungreja</h2>
        <p className="text-lg text-primary-foreground/80 mt-2">Mencetak Generasi Unggul dan Berkarakter</p>
      </div>
    </div>
  )
}
