"use client";

import { useEffect, useState, useRef } from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';
import { GraduationCap, Users, Award, BookOpen } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

const Counter = ({ to }: { to: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const mounted = useMounted();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    const increment = to / totalFrames;

    const counter = () => {
      start += increment;
      if (start < to) {
        setCount(Math.ceil(start));
        requestAnimationFrame(counter);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(counter);
  }, [to, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export default function Stats() {
  const mounted = useMounted();
  const firestore = useFirestore();

  const applicationsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'applications')) : null, [firestore]);
  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);
  const programsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'vocationalPrograms')) : null, [firestore]);
  
  const { data: applications } = useCollection(applicationsQuery);
  const { data: users } = useCollection(usersQuery);
  const { data: programs } = useCollection(programsQuery);

  const schoolStats = [
    { value: applications?.filter(app => app.status === 'accepted').length || 1200, label: 'Students', icon: GraduationCap },
    { value: users?.filter(u => u.role === 'Admin').length || 50, label: 'Expert Teachers', icon: Users },
    { value: 95, label: 'Graduation Rate (%)', icon: Award },
    { value: programs?.length || 4, label: 'Vocational Programs', icon: BookOpen },
  ];

  return (
    <div className="bg-primary text-primary-foreground py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {schoolStats.map((stat, index) => (
            <div key={stat.label} className={cn("flex flex-col items-center gap-2", {
                "animate-fade-in": mounted
            })} style={{ animationDelay: `${index * 150}ms` }}>
              <stat.icon className="h-12 w-12 text-accent" />
              <div className="text-4xl font-extrabold font-headline tracking-tighter">
                {mounted ? <Counter to={stat.value} /> : '0'}{stat.label.includes('%') && '%'}
              </div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">{stat.label.replace(' (%)', '')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
