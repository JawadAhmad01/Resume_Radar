import { KeywordAnalysis } from '@shared/schema';

/**
 * Extract important keywords from a job description
 */
export function extractKeywords(text: string): string[] {
  // Convert to lowercase and remove punctuation
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words = cleanedText.split(/\s+/);
  
  // Remove common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
    'by', 'about', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'of', 'from', 'we', 'our', 'you', 'your',
    'they', 'their', 'he', 'she', 'it', 'his', 'her', 'its'
  ]);
  
  const filteredWords = words.filter(word => !stopWords.has(word) && word.length > 2);
  
  // Count word frequencies
  const wordFrequency: Record<string, number> = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency and get top words
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Extract technical terms and skills (simplified approach)
  const technicalTerms = new Set([
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'express',
    'mongodb', 'sql', 'mysql', 'postgresql', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'cicd', 'devops', 'agile', 'scrum', 'java', 'python', 'ruby',
    'php', 'go', 'rust', 'swift', 'kotlin', 'csharp', 'dotnet', 'scala', 'html',
    'css', 'sass', 'less', 'webpack', 'babel', 'redux', 'graphql', 'rest', 'api',
    'oauth', 'jwt', 'authentication', 'authorization', 'security', 'testing',
    'jest', 'mocha', 'cypress', 'selenium', 'git', 'github', 'gitlab', 'bitbucket',
    'jira', 'confluence', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
    'xd', 'ui', 'ux', 'responsive', 'mobile', 'algorithms', 'data structures',
    'architecture', 'design patterns', 'solid', 'linux', 'bash', 'shell',
    'frontend', 'backend', 'fullstack', 'database', 'nosql', 'redis', 'elasticsearch',
    'kibana', 'logstash', 'monitoring', 'logging', 'performance', 'optimization',
    'accessibility', 'i18n', 'l10n', 'internationalization', 'localization',
    'seo', 'analytics', 'marketing', 'saas', 'cloud', 'serverless', 'microservices',
    'architecture', 'scalability', 'high availability', 'distributed systems',
    'caching', 'load balancing', 'networking', 'security', 'penetration testing',
    'ethical hacking', 'cybersecurity'
  ]);
  
  const keywordSet = new Set<string>();
  
  // Add common technical terms from the job description
  for (const word of filteredWords) {
    if (technicalTerms.has(word)) {
      keywordSet.add(word);
    }
  }
  
  // Add frequently mentioned words
  for (const word of sortedWords.slice(0, 30)) {
    keywordSet.add(word);
  }
  
  // Look for multi-word technical terms (simplified)
  const phrases = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .match(/\w+\s+\w+\s+\w+|\w+\s+\w+/g) || [];
  
  for (const phrase of phrases) {
    // Check if the entire phrase is a technical term
    if (technicalTerms.has(phrase)) {
      keywordSet.add(phrase);
    }
    // Check composite terms like "machine learning"
    else if (phrase.includes(' ') && 
             technicalTerms.has(phrase.split(' ')[0]) || 
             technicalTerms.has(phrase.split(' ')[1])) {
      keywordSet.add(phrase);
    }
  }
  
  return Array.from(keywordSet);
}

/**
 * Check if a keyword appears in the given text
 */
export function keywordAppears(keyword: string, text: string): boolean {
  const regex = new RegExp(`\\b${keyword}\\b`, 'i');
  return regex.test(text);
}

/**
 * Count occurrences of a keyword in text
 */
export function countKeywordOccurrences(keyword: string, text: string): number {
  const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Check if two terms are similar (simplified implementation)
 */
export function areSimilarTerms(term1: string, term2: string): boolean {
  // Simple substring check
  return term1.includes(term2) || term2.includes(term1);
}

/**
 * Perform keyword matching analysis between resume and job description
 */
export function performKeywordAnalysis(resumeText: string, jobDescription: string): KeywordAnalysis {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);
  
  const found: string[] = [];
  const missing: string[] = [];
  const partial: string[] = [];
  const density: {
    keyword: string;
    jobCount: number;
    resumeCount: number;
    match: 'Great' | 'Good' | 'Partial' | 'Missing';
  }[] = [];
  
  // Analyze each job keyword
  for (const keyword of jobKeywords) {
    const jobCount = countKeywordOccurrences(keyword, jobDescription);
    const resumeCount = countKeywordOccurrences(keyword, resumeText);
    
    // Check if keyword appears exactly
    if (keywordAppears(keyword, resumeText)) {
      found.push(keyword);
      
      let match: 'Great' | 'Good' | 'Partial';
      if (resumeCount >= jobCount) {
        match = 'Great';
      } else if (resumeCount >= jobCount * 0.5) {
        match = 'Good';
      } else {
        match = 'Partial';
      }
      
      density.push({
        keyword,
        jobCount,
        resumeCount,
        match
      });
    } 
    // Check for partial matches
    else {
      let isPartialMatch = false;
      
      for (const resumeKeyword of resumeKeywords) {
        if (areSimilarTerms(keyword, resumeKeyword)) {
          partial.push(keyword);
          isPartialMatch = true;
          
          density.push({
            keyword,
            jobCount,
            resumeCount: countKeywordOccurrences(resumeKeyword, resumeText),
            match: 'Partial'
          });
          
          break;
        }
      }
      
      // If no match at all
      if (!isPartialMatch) {
        missing.push(keyword);
        
        density.push({
          keyword,
          jobCount,
          resumeCount: 0,
          match: 'Missing'
        });
      }
    }
  }
  
  // Sort density by jobCount for the most relevant keywords
  density.sort((a, b) => b.jobCount - a.jobCount);
  
  // Limit to top results
  const limitedDensity = density.slice(0, 10);
  
  return {
    found,
    missing,
    partial,
    density: limitedDensity
  };
}
