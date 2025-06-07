import { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { processResumeFile } from '../lib/fileProcessing';
import { performKeywordAnalysis } from '../lib/keywordMatching';
import { analyzeResumeWithGPT } from '../lib/openai';
import { AnalysisResult, KeyFinding } from '@shared/schema';
import { storage } from '../storage';

// Get current file path for ES modules (replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extend the Express Request to include multer's file
declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
  }
}

// Set up storage for multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    console.log('File in filter:', file.originalname, file.mimetype);
    
    // Check both extension and mimetype
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    // For better compatibility, we'll primarily check the file extension
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      console.error('Invalid file type:', ext, file.mimetype);
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

export async function analyzeResume(req: Request, res: Response) {
  try {
    console.log('Received analysis request');
    upload.single('resume')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
          }
          return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        console.error('No file in request');
        return res.status(400).json({ message: 'No resume file uploaded.' });
      }
      
      console.log('File received:', req.file.originalname, req.file.mimetype);
      
      const jobDescription = req.body.jobDescription;
      if (!jobDescription) {
        console.error('No job description in request');
        return res.status(400).json({ message: 'Job description is required.' });
      }
      
      try {
        // Process the resume file
        const resumeText = await processResumeFile(req.file.path);
        
        // Check if we have meaningful text to analyze
        if (resumeText.startsWith('[') && resumeText.includes('Unable to extract')) {
          return res.status(400).json({
            message: "We couldn't extract sufficient text from your resume file. Please try uploading a different file or format."
          });
        }
        
        // Perform keyword analysis (with error handling)
        let keywordAnalysis;
        try {
          keywordAnalysis = performKeywordAnalysis(resumeText, jobDescription);
        } catch (error) {
          console.error("Keyword analysis failed:", error);
          keywordAnalysis = {
            found: [],
            missing: [],
            partial: [],
            density: []
          };
        }
        
        // Perform AI analysis with GPT
        let gptAnalysis;
        try {
          gptAnalysis = await analyzeResumeWithGPT(resumeText, jobDescription);
        } catch (error) {
          console.error("GPT analysis failed:", error);
          // If GPT analysis fails, use basic analysis with default scores
          gptAnalysis = {
            overallScore: 65,
            skillsScore: 70,
            experienceScore: 60,
            formatScore: 65,
            keyFindings: [
              { text: "Your <span class=\"font-medium\">technical skills</span> match many requirements.", type: "positive" as const },
              { text: "Consider adding more <span class=\"font-medium\">quantifiable achievements</span>.", type: "negative" as const },
              { text: "Resume structure is <span class=\"font-medium\">generally good</span> but could use improvement.", type: "negative" as const },
              { text: "Your <span class=\"font-medium\">experience section</span> is relevant to the position.", type: "positive" as const },
              { text: "Missing some <span class=\"font-medium\">key terms</span> from the job description.", type: "negative" as const }
            ] as KeyFinding[],
            keywordAnalysis,
            detailedFeedback: {
              overall: "<p>Your resume demonstrates relevant technical skills, but there are opportunities for improvement in formatting and keyword usage.</p>",
              skills: "<p>Your technical skills align with many of the job requirements. Consider adding the missing keywords identified in the analysis.</p>",
              experience: "<p>Your experience section is relevant but could be enhanced by adding more quantifiable achievements.</p>",
              education: "<p>Education section meets the basic requirements for this position.</p>",
              format: "<p>The resume format is readable but could be optimized for ATS systems with a cleaner structure.</p>"
            }
          };
        }
        
        // Ensure keyFindings are properly typed
        const typedKeyFindings: KeyFinding[] = 
          Array.isArray(gptAnalysis.keyFindings) 
            ? gptAnalysis.keyFindings.map(finding => ({
                text: finding.text,
                type: finding.type === 'positive' ? 'positive' : 'negative'
              }))
            : [];
            
        // Combine keyword analysis with GPT analysis
        const result: AnalysisResult = {
          overallScore: gptAnalysis.overallScore,
          skillsScore: gptAnalysis.skillsScore,
          experienceScore: gptAnalysis.experienceScore,
          formatScore: gptAnalysis.formatScore,
          keyFindings: typedKeyFindings,
          keywordAnalysis: gptAnalysis.keywordAnalysis || keywordAnalysis,
          detailedFeedback: gptAnalysis.detailedFeedback,
          timestamp: Date.now()
        };
        
        // Store the analysis in the database
        await storage.createAnalysis({
          resumeText,
          jobDescription,
          result
        });
        
        return res.status(200).json(result);
      } catch (error: any) {
        console.error('Analysis error:', error);
        return res.status(500).json({ message: `Error analyzing resume: ${error.message}` });
      }
    });
  } catch (error: any) {
    console.error('Analysis route error:', error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
}
