'use client';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-citation-700 to-citation-500 text-white">
      <div className="container px-4 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Perfect Citations, Every Time</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of students and researchers who trust CiteScholar for their academic
            references. Start generating accurate citations for free.
          </p>
          <Button className="bg-white text-citation-500 hover:bg-gray-100 px-8 py-6 text-lg">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
