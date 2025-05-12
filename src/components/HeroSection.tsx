'use client';

import { Button } from './ui/button';

const HeroSection = () => {
  return (
    <main id="logo" className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Generate Perfect Citations
          <br />
          <span className="inline-block">
            in <span className="text-citation-700">Seconds</span>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-12">
          The smartest citation tool for researchers, students, and academics. Format your
          references in IEEE, Harvard, APA, MLA and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-citation-700 px-8 py-6 text-white rounded-md hover:bg-citation-800 transition-colors text-lg font-medium"
            onClick={() => {
              document.getElementById('citationgenerator')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started — It&apos;s Free
          </Button>
          <Button
            size="lg"
            className="text-citation-700 px-8 py-6 bg-white hover:bg-neutral-100 hover:text-citation-800 border border-citation-800"
          >
            Watch Demo
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-12 my-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-citation"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-citation"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
