'use client';

import CallToAction from '@/components/CallToAction';
import CitationGenerator from '@/components/CitationGenerator';
import FAQSection from '@/components/FAQ';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import UniversitySection from '@/components/UniversitySection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <CitationGenerator />
      <FAQSection />
      <UniversitySection />
      <CallToAction />
      <Footer />
    </div>
  );
}
