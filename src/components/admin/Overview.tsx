"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminOverviewData } from "@/lib/placeholder-data"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { GraduationCap, Users } from "lucide-react"

export default function Overview() {
  const firestore = useFirestore()

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "students"))
  }, [firestore])
  const { data: students } = useCollection(studentsQuery)

  const applicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "applications"))
  }, [firestore])
  const { data: applications } = useCollection(applicationsQuery)

  const overviewData = [
    { title: "Total Students", value: students?.length ?? 0, change: "", icon: Users, collection: "students" },
    { title: "New Applications", value: applications?.length ?? 0, change: "", icon: GraduationCap, collection: "applications" },
    ...adminOverviewData.slice(2),
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
              {item.change && <p className="text-xs text-muted-foreground">
                {item.change}
              </p>}
            </CardContent>
          </Card>
      ))}
    </div>
  )
}
