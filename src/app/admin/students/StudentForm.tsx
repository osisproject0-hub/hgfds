
"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useCollection, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { collection, doc, serverTimestamp, query } from "firebase/firestore"
import type { Student } from "./page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

type Program = {
  id: string;
  name: string;
}

const formSchema = z.object({
  firstName: z.string().min(2, "Nama depan wajib diisi."),
  lastName: z.string().min(2, "Nama belakang wajib diisi."),
  email: z.string().email("Format email tidak valid."),
  nisn: z.string().min(10, "NISN harus 10 digit.").max(10, "NISN harus 10 digit."),
  programId: z.string({ required_error: "Program keahlian wajib dipilih." }),
})

interface StudentFormProps {
  student: Student | null;
  onSave: () => void;
}

export function StudentForm({ student, onSave }: StudentFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()
  
  const programsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "vocationalPrograms"));
  }, [firestore]);
  
  const { data: programs, isLoading: isLoadingPrograms } = useCollection<Program>(programsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: student || {
      firstName: "",
      lastName: "",
      email: "",
      nisn: "",
      programId: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!firestore) return

      try {
        if (student?.id) {
          const docRef = doc(firestore, "students", student.id)
          await setDocumentNonBlocking(docRef, values, { merge: true })
          toast({ title: "Berhasil", description: "Data siswa berhasil diperbarui." })
        } else {
          const dataToSave = {
              ...values,
              enrollmentDate: serverTimestamp(),
          }
          const colRef = collection(firestore, "students")
          await addDocumentNonBlocking(colRef, dataToSave)
          toast({ title: "Berhasil", description: "Siswa baru telah ditambahkan." })
        }
        onSave()
      } catch (error) {
        console.error("Error saving student:", error)
        toast({
          variant: "destructive",
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan. Silakan coba lagi.",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nama Depan</FormLabel>
                <FormControl>
                    <Input placeholder="John" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nama Belakang</FormLabel>
                <FormControl>
                    <Input placeholder="Doe" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="siswa@example.com" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nisn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NISN</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="programId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Program Keahlian</FormLabel>
                {isLoadingPrograms ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Pilih program" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {programs?.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                            {program.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
        </Button>
      </form>
    </Form>
  )
}
