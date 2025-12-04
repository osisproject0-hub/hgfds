
"use client"

import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/app/admin/settings/page';

export default function Announcements() {
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteSettings', 'main') : null, [firestore]);
  const { data: settings } = useDoc<SiteSettings>(settingsDocRef);
  
  const announcementText = settings?.announcementText;
  const announcementLink = settings?.announcementLink || "#";
  
  if (!announcementText) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-2 text-sm md:px-6">
        <Megaphone className="h-5 w-5" />
        <p className="font-medium">
          {announcementText}
        </p>
        <Link href={announcementLink} className="ml-4 font-semibold underline underline-offset-2 hover:text-accent transition-colors" prefetch={false}>
          Pelajari Lebih Lanjut
        </Link>
      </div>
    </div>
  );
}
