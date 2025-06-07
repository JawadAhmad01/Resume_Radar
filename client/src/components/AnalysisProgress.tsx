import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  currentStep: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress, currentStep }) => {
  const steps = [
    'Parsing resume document',
    'Analyzing job description',
    'Running keyword matching algorithms',
    'Generating AI feedback',
    'Compiling results'
  ];

  return (
    <section id="analysis-progress" className="px-6 py-12 border-t border-neutral-200">
      <h2 className="text-2xl font-semibold mb-8">Analyzing Your Documents</h2>
      
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Analysis Progress</span>
            <span className="text-sm font-medium text-primary" id="progress-percentage">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isInProgress = index === currentStep;
            
            return (
              <div key={index} className="flex items-center">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-3">
                    <Check className="text-white h-3 w-3" />
                  </div>
                ) : isInProgress ? (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <div className="animate-spin h-3 w-3 border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                )}
                <span className={`${isCompleted || isInProgress ? 'text-foreground font-medium' : 'text-neutral-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnalysisProgress;
