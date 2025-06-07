import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { AnalysisResult } from '@shared/schema';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AnalysisWorkflow from '@/components/AnalysisWorkflow';
import FileUploadSection from '@/components/FileUploadSection';
import AnalysisProgress from '@/components/AnalysisProgress';
import AnalysisResults from '@/components/AnalysisResults';

const HomePage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const analyzeResumeMutation = useMutation({
    mutationFn: async ({ resume, jobDescription }: { resume: File; jobDescription: string }) => {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('jobDescription', jobDescription);
      
      console.log('Submitting form data:', { 
        resumeName: resume.name, 
        resumeType: resume.type, 
        resumeSize: resume.size, 
        jobDescriptionLength: jobDescription.length 
      });
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        let errorMessage = 'Error analyzing the resume';
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
        } catch {
          // If we can't parse JSON, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Keep default message
          }
        }
        throw new Error(errorMessage);
      }
      
      return await response.json() as AnalysisResult;
    },
    onMutate: () => {
      setShowUpload(false);
      setShowProgress(true);
      setShowResults(false);
      
      // Simulate progress for better UX
      setProgress(0);
      setCurrentStep(0);
      
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 5 + 5;
          const newProgress = Math.min(prev + increment, 90);
          
          // Update current step based on progress
          if (newProgress > 20 && currentStep < 1) setCurrentStep(1);
          else if (newProgress > 40 && currentStep < 2) setCurrentStep(2);
          else if (newProgress > 60 && currentStep < 3) setCurrentStep(3);
          
          return newProgress;
        });
      }, 300);
      
      return progressInterval;
    },
    onSuccess: (data, _, progressInterval) => {
      clearInterval(progressInterval);
      
      // Finish progress animation
      setProgress(100);
      setCurrentStep(4);
      
      // Wait a moment before showing results
      setTimeout(() => {
        setAnalysisResult(data);
        setShowProgress(false);
        setShowResults(true);
      }, 500);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been successfully analyzed!",
      });
    },
    onError: (error, _, progressInterval) => {
      clearInterval(progressInterval);
      
      setShowProgress(false);
      setShowUpload(true);
      
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze your resume. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const scrollToUpload = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleAnalyzeResume = (formData: { resume: File; jobDescription: string }) => {
    analyzeResumeMutation.mutate(formData);
  };
  
  const handleRestart = () => {
    setShowResults(false);
    setShowUpload(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="app-container">
      <Header />
      
      <main className="bg-white rounded-xl shadow-sm overflow-hidden">
        <HeroSection onStartAnalyzing={scrollToUpload} />
        
        <AnalysisWorkflow />
        
        <div ref={uploadSectionRef}>
          {showUpload && (
            <FileUploadSection 
              onAnalyze={handleAnalyzeResume} 
              isAnalyzing={analyzeResumeMutation.isPending}
            />
          )}
        </div>
        
        {showProgress && (
          <AnalysisProgress 
            progress={progress} 
            currentStep={currentStep}
          />
        )}
        
        {showResults && analysisResult && (
          <AnalysisResults 
            result={analysisResult}
            onRestart={handleRestart}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
