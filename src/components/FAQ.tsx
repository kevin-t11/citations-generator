'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'How does the citation generator work?',
    answer:
      'Our citation generator uses AI technology to analyze the content of papers, websites, or PDFs you upload. It automatically extracts relevant information like authors, publication date, title, and publisher, then formats it according to your chosen citation style.',
  },
  {
    question: 'Which citation formats are supported?',
    answer:
      'We support all major citation formats including APA, MLA, Chicago, Harvard, IEEE, AMA, ASA, and Bluebook. Our tool stays updated with the latest editions and changes to these formats.',
  },
  {
    question: 'Is this citation generator free to use?',
    answer:
      'Yes! The basic citation generation functionality is completely free. For additional features such as unlimited saved citations, bibliography organization, and premium export options, we offer affordable subscription plans.',
  },
  {
    question: 'How accurate are the citations?',
    answer:
      'We pride ourselves on the accuracy of our citations. Our system is regularly updated to match the latest citation guidelines and is trained by academic experts. However, we always recommend a final review of your citations, especially for complex sources.',
  },
  {
    question: 'Can I edit the generated citations?',
    answer:
      'Absolutely! After a citation is generated, you can edit any field to ensure it matches your specific requirements. Changes are applied instantly to your formatted citation.',
  },
  {
    question: 'How do I save my citations for later use?',
    answer:
      'Create a free account to automatically save all your citations. You can organize them into projects, add notes, and access them from any device. Your citations will remain in your account until you choose to delete them.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-neutral-100">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-citation-700">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium">
            Everything you need to know about our citation generator.
          </p>
        </div>

        <div className="max-w-3xl mx-auto text-citation-500">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium [&>svg]:text-citation-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
