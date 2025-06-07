import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share, Pencil, FileText, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { KeywordAnalysis, AnalysisResult } from '@shared/schema';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onRestart: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onRestart }) => {
  const { overallScore, skillsScore, experienceScore, formatScore, keyFindings, keywordAnalysis, detailedFeedback, timestamp } = result;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const renderKeywordGroup = (keywords: string[], type: 'found' | 'missing' | 'partial') => {
    const colorClasses = {
      found: 'bg-secondary/10 text-secondary',
      missing: 'bg-accent/10 text-accent',
      partial: 'bg-primary/10 text-primary'
    };
    
    return (
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, idx) => (
          <div key={idx} className={`px-3 py-2 ${colorClasses[type]} rounded-md inline-block`}>
            {keyword}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section id="analysis-results" className="border-t border-neutral-200">
      <div className="px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Analysis Results</h2>
            <p className="text-neutral-600">Completed on {formatDate(timestamp)}</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Report
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>
        
        {/* Score Overview */}
        <div className="bg-neutral-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Match Score */}
            <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#0066CC" 
                    strokeWidth="10" 
                    strokeDasharray="282.7" 
                    strokeDashoffset={282.7 - (282.7 * overallScore / 100)} 
                  />
                  <text x="50" y="50" textAnchor="middle" dy="7" fontSize="20" fontWeight="bold" fill="#2C3E50">{overallScore}%</text>
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground mt-2">Overall Match</p>
            </div>
            
            {/* Score Categories */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Skills Match */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Skills Match</span>
                    <span className="text-secondary font-semibold">{skillsScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: `${skillsScore}%` }}></div>
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">
                    {keywordAnalysis.found.length} of {keywordAnalysis.found.length + keywordAnalysis.missing.length} required skills found
                  </p>
                </CardContent>
              </Card>
              
              {/* Experience Match */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Experience Match</span>
                    <span className="text-primary font-semibold">{experienceScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${experienceScore}%` }}></div>
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">Experience level matches most requirements</p>
                </CardContent>
              </Card>
              
              {/* Format Quality */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Format Quality</span>
                    <span className="text-accent font-semibold">{formatScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${formatScore}%` }}></div>
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">Structure needs improvement for ATS optimization</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Key Findings Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {keyFindings.map((finding, idx) => (
                  <div key={idx} className="flex">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${finding.type === 'positive' ? 'bg-secondary/20' : 'bg-accent/20'} flex items-center justify-center mr-3 mt-0.5`}>
                      {finding.type === 'positive' ? (
                        <Check className="text-secondary h-3 w-3" />
                      ) : (
                        <AlertTriangle className="text-accent h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className="text-foreground" dangerouslySetInnerHTML={{ __html: finding.text }}></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Keyword Analysis */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Keyword Analysis</h3>
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-foreground mb-4">Here's how your resume matches the keywords in the job description:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Found Keywords */}
                  <div>
                    <h4 className="text-sm font-medium uppercase text-neutral-500 mb-3">Found Keywords</h4>
                    {renderKeywordGroup(keywordAnalysis.found, 'found')}
                  </div>
                  
                  {/* Missing Keywords */}
                  <div>
                    <h4 className="text-sm font-medium uppercase text-neutral-500 mb-3">Missing Keywords</h4>
                    {renderKeywordGroup(keywordAnalysis.missing, 'missing')}
                  </div>
                  
                  {/* Partially Matched */}
                  <div>
                    <h4 className="text-sm font-medium uppercase text-neutral-500 mb-3">Partially Matched</h4>
                    {renderKeywordGroup(keywordAnalysis.partial, 'partial')}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium uppercase text-neutral-500 mb-3">Keyword Density Analysis</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Keyword</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Job Description</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Your Resume</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {keywordAnalysis.density.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 text-sm text-foreground">{item.keyword}</td>
                          <td className="py-3 px-4 text-sm text-foreground">{item.jobCount} mentions</td>
                          <td className="py-3 px-4 text-sm text-foreground">{item.resumeCount} mentions</td>
                          <td className={`py-3 px-4 text-sm ${
                            item.match === 'Great' || item.match === 'Good' 
                              ? 'text-secondary' 
                              : item.match === 'Partial' 
                                ? 'text-primary' 
                                : 'text-accent'
                          }`}>
                            {item.match}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Feedback */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Detailed AI Feedback</h3>
          <Card>
            <Tabs defaultValue="overall">
              <div className="border-b border-neutral-200">
                <TabsList className="h-auto p-0">
                  <TabsTrigger value="overall" className="py-4 px-6 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Overall</TabsTrigger>
                  <TabsTrigger value="skills" className="py-4 px-6 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Skills</TabsTrigger>
                  <TabsTrigger value="experience" className="py-4 px-6 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Experience</TabsTrigger>
                  <TabsTrigger value="education" className="py-4 px-6 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Education</TabsTrigger>
                  <TabsTrigger value="format" className="py-4 px-6 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Format</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overall" className="p-6">
                <div className="space-y-6">
                  <div className="prose max-w-none text-foreground">
                    <div dangerouslySetInnerHTML={{ __html: detailedFeedback.overall }}></div>
                    
                    {detailedFeedback.summaryRevision && (
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mt-6">
                        <h4 className="text-md font-medium mb-2">Example Revision for Professional Summary</h4>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                          <div className="flex-1 p-3 bg-white border border-neutral-200 rounded-md">
                            <h5 className="text-sm font-medium text-accent mb-2">Current Summary</h5>
                            <p className="text-sm text-neutral-700">{detailedFeedback.summaryRevision.current}</p>
                          </div>
                          <div className="flex-1 p-3 bg-white border border-neutral-200 rounded-md">
                            <h5 className="text-sm font-medium text-secondary mb-2">Improved Summary</h5>
                            <p className="text-sm text-neutral-700">{detailedFeedback.summaryRevision.improved}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="p-6">
                <div className="prose max-w-none text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: detailedFeedback.skills }}></div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="p-6">
                <div className="prose max-w-none text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: detailedFeedback.experience }}></div>
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="p-6">
                <div className="prose max-w-none text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: detailedFeedback.education }}></div>
                </div>
              </TabsContent>
              
              <TabsContent value="format" className="p-6">
                <div className="prose max-w-none text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: detailedFeedback.format }}></div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Recommendations */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Pencil className="text-primary h-5 w-5" />
                </div>
                <h4 className="text-lg font-medium mb-2">Revise Your Resume</h4>
                <p className="text-neutral-600 mb-4">Apply the suggestions to create a targeted version of your resume for this position.</p>
                <a href="#" className="text-primary font-medium hover:text-primary/80">Tips for effective revisions →</a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-primary h-5 w-5" />
                </div>
                <h4 className="text-lg font-medium mb-2">Create a Cover Letter</h4>
                <p className="text-neutral-600 mb-4">Use our AI-powered tools to draft a personalized cover letter that complements your resume.</p>
                <a href="#" className="text-primary font-medium hover:text-primary/80">Generate cover letter →</a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <RotateCcw className="text-primary h-5 w-5" />
                </div>
                <h4 className="text-lg font-medium mb-2">Re-Analyze Resume</h4>
                <p className="text-neutral-600 mb-4">After making changes, run another analysis to see if your match score improves.</p>
                <Button 
                  variant="link" 
                  className="text-primary font-medium hover:text-primary/80 p-0 h-auto"
                  onClick={onRestart}
                >
                  Start new analysis →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisResults;
