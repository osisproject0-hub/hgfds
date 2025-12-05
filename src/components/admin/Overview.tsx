
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { GraduationCap, Users, Newspaper, Mail } from "lucide-react"

export default function Overview() {
  const firestore = useFirestore()

  const teachersQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "users"), where("role", "in", ["Guru", "Super Admin"]))
  }, [firestore])
  const { data: teachers } = useCollection(teachersQuery)

  const applicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "applications"))
  }, [firestore])
  const { data: applications } = useCollection(applicationsQuery)

  const newsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "newsArticles"))
  }, [firestore])
  const { data: news } = useCollection(newsQuery)
  
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "contactMessages"))
  }, [firestore])
  const { data: messages } = useCollection(messagesQuery)

  const overviewData = [
    { title: "Pendaftar Baru", value: applications?.length ?? 0, icon: GraduationCap },
    { title: "Total Guru & Staff", value: teachers?.length ?? 0, icon: Users },
    { title: "Artikel Berita", value: news?.length ?? 0, icon: Newspaper },
    { title: "Total Pesan", value: messages?.length ?? 0, icon: Mail },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {overviewData.map((item) => (
         <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{item.value}</div>
              <p className="text-xs text-muted-foreground">&nbsp;</p>
            </CardContent>
          </Card>
      ))}
    </div>
  )
}
