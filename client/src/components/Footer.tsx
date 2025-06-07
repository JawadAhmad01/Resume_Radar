import React from 'react';
import { FileText } from 'lucide-react';
import { FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-neutral-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-4">
            <div className="text-primary mr-2">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-foreground">ResumeAI</span>
          </div>
          <p className="text-neutral-600 mb-4">AI-powered resume analysis to help you land your dream job.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-400 hover:text-primary">
              <FaTwitter />
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary">
              <FaInstagram />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold uppercase text-neutral-500 mb-4">Features</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-neutral-600 hover:text-primary">Resume Analysis</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Cover Letter Builder</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Interview Preparation</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Career Resources</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold uppercase text-neutral-500 mb-4">Resources</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-neutral-600 hover:text-primary">Help Center</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Blog</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Resume Templates</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Industry Guides</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold uppercase text-neutral-500 mb-4">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-neutral-600 hover:text-primary">About Us</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Pricing</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="text-neutral-600 hover:text-primary">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-neutral-500 text-sm">
        <p>© 2023 ResumeAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
