import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';

interface FileUploadSectionProps {
  onAnalyze: (formData: { resume: File; jobDescription: string }) => void;
  isAnalyzing: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  
  useEffect(() => {
    setCharCount(jobDescription.length);
  }, [jobDescription]);
  
  const handleResumeChange = (file: File | null) => {
    // Ensure filename has proper extension
    if (file) {
      const fileName = file.name.toLowerCase();
      if (!(fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx'))) {
        alert('Please upload a PDF, DOC, or DOCX file only.');
        return;
      }
    }
    setResume(file);
  };
  
  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };
  
  const clearJobDescription = () => {
    setJobDescription('');
  };
  
  const handleAnalyze = () => {
    if (resume && jobDescription.trim()) {
      onAnalyze({ resume, jobDescription });
    }
  };
  
  const isButtonDisabled = !resume || !jobDescription.trim() || isAnalyzing;
  
  return (
    <section id="upload-section" className="px-6 py-12 border-t border-neutral-200">
      <h2 className="text-2xl font-semibold mb-8">Upload Your Documents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resume Upload */}
        <div>
          <h3 className="text-lg font-medium mb-3">Resume</h3>
          <FileUpload
            id="resume-upload"
            label="resume"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onFileChange={handleResumeChange}
            description="Supports PDF, DOC, DOCX (Max 5MB)"
          />
        </div>
        
        {/* Job Description */}
        <div>
          <h3 className="text-lg font-medium mb-3">Job Description</h3>
          <div className="job-description-container">
            <Textarea
              id="job-description"
              className="w-full h-40 p-4 border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={handleJobDescriptionChange}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-neutral-500"><span id="char-count">{charCount}</span> characters</p>
              <button 
                id="clear-jd" 
                className="text-sm text-neutral-500 hover:text-primary"
                onClick={clearJobDescription}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button
          id="analyze-btn"
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAnalyze}
          disabled={isButtonDisabled}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Documents"}
        </Button>
        <p className="mt-3 text-sm text-neutral-500">This may take up to 60 seconds depending on document length</p>
      </div>
    </section>
  );
};

export default FileUploadSection;
