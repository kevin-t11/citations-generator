'use client';
import { Archive, CheckSquare, Clock, Download, Edit, FileUp } from 'lucide-react';

const features = [
  {
    icon: <FileUp className="w-6 h-6" />,
    title: 'Use for free',
    description:
      'Citation Generator lets you organize, edit, and create entire bibliographies for free.',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Get accurate results',
    description:
      'Citation Generator is trained by experts and always up to date with the latest styles.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Work quickly',
    description:
      'Our citation maker is simple and instant, so you can create a full bibliography in minutes.',
  },
  {
    icon: <Edit className="w-6 h-6" />,
    title: 'Edit easily',
    description:
      'Need to edit a source? Just click the pencil icon to make edits, and your citation will be updated instantly.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Download your references anytime',
    description:
      "Once you're done with Citation Generator, just copy or export your citation list.",
  },
  {
    icon: <Archive className="w-6 h-6" />,
    title: 'Save lists for later',
    description:
      'With a CiteScholar account, all of your citations are automatically saved forever.',
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-neutral-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-citation-700">
            Why Choose CiteScholar?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our citation generator is designed to make academic referencing simple, accurate and
            efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-7xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-citation-100 transition-all duration-300 bg-white group"
            >
              <div className="p-3 rounded-full bg-citation-50 text-citation-500 inline-block mb-4 group-hover:bg-citation-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-citation-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
