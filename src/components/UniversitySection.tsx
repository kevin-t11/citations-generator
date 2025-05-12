'use client';
import { Card, CardContent } from '@/components/ui/card';

const universities = [
  {
    name: 'Harvard University',
    logo: 'H',
    quote: 'Recommended by the Department of Academic Writing',
  },
  {
    name: 'Stanford University',
    logo: 'S',
    quote: 'Used in research methodology courses',
  },
  {
    name: 'MIT',
    logo: 'MIT',
    quote: 'Preferred by engineering students',
  },
  {
    name: 'Oxford University',
    logo: 'O',
    quote: 'Endorsed by faculty members',
  },
  {
    name: 'Cambridge University',
    logo: 'C',
    quote: 'Integrated into student resources',
  },
  {
    name: 'UC Berkeley',
    logo: 'UCB',
    quote: 'Recommended in writing centers',
  },
];

const UniversitiesSection = () => {
  return (
    <section id="universities" className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-citation-700">
            Trusted by Leading Universities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium">
            Our citation tool is used and recommended by academic institutions worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto ">
          {universities.map((university, index) => (
            <Card
              key={index}
              className="border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden bg-neutral-50 hover:shadow-citation-100 shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-citation-600 to-citation-500 text-white flex items-center justify-center font-bold text-lg mr-3">
                    {university.logo}
                  </div>
                  <h3 className="font-semibold text-citation-700">{university.name}</h3>
                </div>
                <p className="text-gray-600 text-sm italic">&quot;{university.quote}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;
