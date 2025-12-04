
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ProgramsTab from "./programs/page"
import NewsTab from "./news/page"
import GalleryTab from "./gallery/page"

export default function AdminContentPage() {
    return (
        <Tabs defaultValue="programs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="programs">Program Kejuruan</TabsTrigger>
                <TabsTrigger value="news">Berita & Acara</TabsTrigger>
                <TabsTrigger value="gallery">Galeri</TabsTrigger>
            </TabsList>
            <TabsContent value="programs">
                <Card>
                    <CardHeader>
                        <CardTitle>Program Kejuruan</CardTitle>
                        <CardDescription>
                            Kelola program kejuruan yang ditawarkan sekolah Anda. Tambah, edit, atau hapus program.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProgramsTab />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="news">
                 <Card>
                    <CardHeader>
                        <CardTitle>Berita & Acara</CardTitle>
                        <CardDescription>
                            Kelola berita, pengumuman, dan acara sekolah.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NewsTab />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="gallery">
                <Card>
                    <CardHeader>
                        <CardTitle>Galeri</CardTitle>
                        <CardDescription>
                           Kelola gambar dan album di galeri sekolah.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GalleryTab />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
