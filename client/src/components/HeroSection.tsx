import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartAnalyzing: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalyzing }) => {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-12 md:p-16 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Get Your Resume AI-Analyzed</h2>
        <p className="text-lg text-neutral-600 mb-6">
          Upload your resume and a job description to receive detailed feedback, keyword matching, and improvement suggestions.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={onStartAnalyzing}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition"
          >
            Start Analyzing
          </Button>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/5 font-medium py-3 px-6 rounded-md transition"
          >
            Learn More
          </Button>
        </div>
      </div>
      <div className="md:w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600" 
          alt="Professional analyzing resume" 
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;
