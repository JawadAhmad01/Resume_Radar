import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="mb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary mr-2">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ResumeAI Analyzer</h1>
            <p className="text-neutral-600">Optimize your resume for job applications</p>
          </div>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="text-primary hover:text-primary/80 font-medium">Home</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary font-medium">How It Works</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary font-medium">Pricing</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary font-medium">FAQ</a></li>
          </ul>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
