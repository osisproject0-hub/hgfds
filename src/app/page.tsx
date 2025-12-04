import Announcements from "@/components/home/Announcements";
import Hero from "@/components/home/Hero";
import FeaturedPrograms from "@/components/home/FeaturedPrograms";
import AboutPreview from "@/components/home/AboutPreview";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import NewsAndEvents from "@/components/home/NewsAndEvents";
import AdmissionsPreview from "@/components/home/AdmissionsPreview";
import PublicLayout from "@/components/layout/PublicLayout";

export default function Home() {
  return (
    <PublicLayout>
        <Announcements />
        <Hero />
        <AboutPreview />
        <Stats />
        <FeaturedPrograms />
        <AdmissionsPreview />
        <Testimonials />
        <NewsAndEvents />
    </PublicLayout>
  );
}

    