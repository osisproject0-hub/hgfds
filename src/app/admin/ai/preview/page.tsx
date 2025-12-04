'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useTransition, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/firebase';

function AIPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState<any | null>(null);

  useEffect(() => {
    const contentStr = searchParams.get('content');
    if (contentStr) {
      try {
        setContent(JSON.parse(contentStr));
      } catch (error) {
        console.error('Failed to parse content from URL', error);
        toast({
          variant: 'destructive',
          title: 'Gagal Memuat Konten',
          description:
            'Data konten yang dihasilkan AI tidak valid. Silakan coba lagi.',
        });
        router.push('/admin');
      }
    }
  }, [searchParams, router, toast]);

  const handleSave = () => {
    if (!content || !firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menyimpan',
        description: 'Tidak ada konten untuk disimpan atau koneksi database gagal.',
      });
      return;
    }

    startTransition(async () => {
      try {
        if (content.contentType === 'newsArticle') {
          const colRef = collection(firestore, 'newsArticles');
          const dataToSave = {
            ...content.data,
            author: user.displayName || user.email || 'Admin AI',
            publicationDate: serverTimestamp(),
          };
          await addDocumentNonBlocking(colRef, dataToSave);
          toast({
            title: 'Berhasil Disimpan!',
            description: 'Artikel berita baru telah ditambahkan.',
          });
          router.push('/admin/content');
        } else {
           throw new Error('Tipe konten tidak didukung.');
        }
      } catch (error) {
        console.error('Error saving AI content:', error);
        toast({
          variant: 'destructive',
          title: 'Gagal Menyimpan',
          description: 'Terjadi kesalahan. Silakan coba lagi.',
        });
      }
    });
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          Pratinjau Konten Buatan AI
        </CardTitle>
        <CardDescription>
          Tinjau konten yang dihasilkan oleh asisten AI. Anda dapat menyimpannya langsung atau kembali untuk mengubah perintah.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.contentType === 'newsArticle' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">{content.data.title}</h2>
             <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
                <Image
                    src={content.data.imageUrl}
                    alt={content.data.title}
                    fill
                    className="object-cover"
                />
            </div>
            <p className="text-sm text-muted-foreground">Kategori: {content.data.category}</p>
            <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap">
              {content.data.content}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>Kembali</Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Simpan Konten</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function AIPreviewPageWrapper() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AIPreviewPage />
      </Suspense>
    );
  }
