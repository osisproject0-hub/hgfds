"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Phone, MapPin } from "lucide-react"
import { useFirestore, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama harus memiliki setidaknya 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  subject: z.string().min(5, { message: "Subjek harus memiliki setidaknya 5 karakter." }),
  message: z.string().min(10, { message: "Pesan harus memiliki setidaknya 10 karakter." }),
})

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!firestore) {
        toast({
          variant: "destructive",
          title: "Gagal Mengirim Pesan",
          description: "Koneksi ke database gagal.",
        })
        return
      }

      try {
        const messagesCol = collection(firestore, "contactMessages")
        await addDocumentNonBlocking(messagesCol, {
          ...values,
          submittedAt: serverTimestamp(),
        })

        toast({
          title: "Pesan Terkirim!",
          description: "Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.",
        })
        form.reset()
      } catch (error) {
        console.error("Error submitting contact form:", error)
        toast({
          variant: "destructive",
          title: "Gagal Mengirim Pesan",
          description: "Terjadi kesalahan. Silakan coba lagi nanti.",
        })
      }
    })
  }

  return (
    <>
      <div className="bg-primary">
          <div className="container mx-auto px-4 md:px-6 py-12 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground font-headline">Hubungi Kami</h1>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                  Kami senang mendengar dari Anda. Silakan isi formulir di bawah atau hubungi kami melalui informasi kontak yang tersedia.
              </p>
          </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold font-headline mb-6">Informasi Kontak</h2>
            <div className="space-y-6 text-muted-foreground">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Alamat</h3>
                  <p>Jl. Raya Kedungreja No.1, Kedungreja, Cilacap, Jawa Tengah, Indonesia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Telepon</h3>
                  <a href="tel:+621234567890" className="hover:text-primary">(123) 456-7890</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:info@smklppmri2.sch.id" className="hover:text-primary">info@smklppmri2.sch.id</a>
                </div>
              </div>
            </div>
             <div className="mt-8 rounded-lg overflow-hidden h-64 md:h-80">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.897369323533!2d108.8778018147768!3d-7.585521994528148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e650b07e559599b%3A0x956965a0e987e83e!2sSMK%20LPPMRI%202%20KEDUNGREJA!5e0!3m2!1sen!2sid!4v1626940854580!5m2!1sen!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border:0 }} 
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-headline mb-6">Kirim Pesan</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjek</FormLabel>
                      <FormControl>
                        <Input placeholder="Tuliskan subjek pesan Anda" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pesan Anda</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tuliskan pesan Anda di sini..." {...field} rows={6} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> : 'Kirim Pesan'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
