import React from 'react';
import { Upload, Bot, CheckSquare } from 'lucide-react';

const AnalysisWorkflow: React.FC = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-2xl font-semibold text-center mb-12">How It Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium mb-2">Upload Documents</h3>
          <p className="text-neutral-600">Upload your resume (PDF/DOC) and paste the job description you're targeting.</p>
        </div>
        
        {/* Step 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Bot className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium mb-2">AI Analysis</h3>
          <p className="text-neutral-600">Our AI analyzes keyword matching, content gaps, and formatting improvements.</p>
        </div>
        
        {/* Step 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckSquare className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium mb-2">Get Results</h3>
          <p className="text-neutral-600">Receive actionable feedback and specific suggestions to improve your resume.</p>
        </div>
      </div>
    </section>
  );
};

export default AnalysisWorkflow;
