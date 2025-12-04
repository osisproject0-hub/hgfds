'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { type User } from '@/app/admin/users/page';
import { type NewsArticle } from '@/app/admin/content/news/page';
import { type Program } from '@/app/admin/content/programs/page';
import { GraduationCap, Newspaper, User as UserIcon, Search, FileText, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createContent } from '@/ai/flows/create-content-flow';
import { useToast } from '@/hooks/use-toast';


type Application = {
  id: string;
  firstName: string;
  lastName: string;
  programId: string;
};

export default function AdminSearch() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);
  const newsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'newsArticles')) : null, [firestore]);
  const programsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'vocationalPrograms')) : null, [firestore]);
  const applicationsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'applications')) : null, [firestore]);

  const { data: users } = useCollection<User>(usersQuery);
  const { data: news } = useCollection<NewsArticle>(newsQuery);
  const { data: programs } = useCollection<Program>(programsQuery);
  const { data: applications } = useCollection<Application>(applicationsQuery);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  const handleAiCreate = async () => {
    if (!search.trim()) return;
    setIsAiLoading(true);
    runCommand(async () => {
        try {
            const result = await createContent({ prompt: search });
            const contentString = encodeURIComponent(JSON.stringify(result));
            router.push(`/admin/ai/preview?content=${contentString}`);
        } catch(error) {
            console.error("AI content creation failed:", error);
            toast({
                variant: 'destructive',
                title: 'Gagal Membuat Konten',
                description: 'Terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.'
            });
        } finally {
            setIsAiLoading(false);
        }
    });
  };

  const programMap = React.useMemo(() => {
    if (!programs) return new Map();
    return new Map(programs.map(p => [p.id, p.name]));
  }, [programs]);


  return (
    <>
      <div
        className="flex items-center text-sm text-muted-foreground w-full rounded-lg bg-secondary pl-3 pr-2 py-1.5 md:w-[200px] lg:w-[336px] cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="flex-1">Cari atau buat...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
            placeholder="Cari atau minta AI membuat konten..." 
            value={search}
            onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          
          {search.trim().length > 2 && (
             <CommandGroup heading="Asisten AI">
               <CommandItem onSelect={handleAiCreate} disabled={isAiLoading}>
                 {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                 <span>Buat konten: "{search}"</span>
               </CommandItem>
             </CommandGroup>
          )}

          {applications && applications.length > 0 && (
            <CommandGroup heading="Pendaftaran">
              {applications.map(app => (
                <CommandItem
                  key={`app-${app.id}`}
                  onSelect={() => runCommand(() => router.push('/admin/admissions'))}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{app.firstName} {app.lastName} - {programMap.get(app.programId) || 'N/A'}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          <CommandSeparator />

          {users && users.length > 0 && (
            <CommandGroup heading="Pengguna">
              {users.map(user => (
                <CommandItem
                  key={`user-${user.id}`}
                  onSelect={() => runCommand(() => router.push('/admin/users'))}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>{user.displayName}</span>
                  <span className="ml-2 text-muted-foreground">{user.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          
          {news && news.length > 0 && (
             <CommandGroup heading="Artikel Berita">
              {news.map(article => (
                <CommandItem
                  key={`news-${article.id}`}
                  onSelect={() => runCommand(() => router.push('/admin/content'))}
                >
                  <Newspaper className="mr-2 h-4 w-4" />
                  <span>{article.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
         
           <CommandSeparator />

          {programs && programs.length > 0 && (
            <CommandGroup heading="Program Kejuruan">
              {programs.map(program => (
                <CommandItem
                  key={`program-${program.id}`}
                  onSelect={() => runCommand(() => router.push('/admin/content'))}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>{program.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
