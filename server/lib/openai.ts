import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export interface AnalysisResponse {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  formatScore: number;
  keyFindings: {
    text: string;
    type: 'positive' | 'negative';
  }[];
  keywordAnalysis: {
    found: string[];
    missing: string[];
    partial: string[];
    density: {
      keyword: string;
      jobCount: number;
      resumeCount: number;
      match: 'Great' | 'Good' | 'Partial' | 'Missing';
    }[];
  };
  detailedFeedback: {
    overall: string;
    skills: string;
    experience: string;
    education: string;
    format: string;
    summaryRevision?: {
      current: string;
      improved: string;
    };
  };
}

export async function analyzeResumeWithGPT(resumeText: string, jobDescription: string): Promise<AnalysisResponse> {
  try {
    const systemPrompt = `
      You are a professional resume analyzer. You will analyze a resume against a job description and provide detailed, actionable feedback.
      For each resume and job description pair, provide:
      
      1. Scores:
         - Overall match score (percentage)
         - Skills match score (percentage)
         - Experience match score (percentage)
         - Format quality score (percentage)
      
      2. Key findings (5-6 bullet points), each marked as positive or negative
      
      3. Keyword analysis:
         - Found keywords (important terms that appear in both the resume and job description)
         - Missing keywords (important terms from job description that are not in the resume)
         - Partially matched keywords (terms with similar meaning but different wording)
         - Keyword density analysis (showing count in job description vs resume)
      
      4. Detailed feedback sections:
         - Overall assessment
         - Skills assessment
         - Experience assessment
         - Education assessment
         - Format and structure assessment
         - If there's a professional summary in the resume, provide an "improved" version
      
      Format your response as a JSON object following the structure defined below. Use HTML for formatting in text fields.
    `;

    const userPrompt = `
      Resume:
      """
      ${resumeText}
      """
      
      Job Description:
      """
      ${jobDescription}
      """
      
      Please analyze the resume against this job description.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No response content from OpenAI");
    }

    return JSON.parse(responseContent) as AnalysisResponse;
  } catch (error: any) {
    console.error("OpenAI analysis error:", error.message);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}
