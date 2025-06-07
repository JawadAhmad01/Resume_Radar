import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { spawn } from 'child_process';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

/**
 * Extract text from PDF file using a simple string extraction method
 * This is a fallback method that performs basic text extraction
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // Read the PDF file as buffer
    const buffer = await readFile(filePath);
    
    // Extract text using a simple string extraction
    // This is not perfect but works as a fallback
    let text = '';
    let inTextObject = false;
    let currentText = '';
    
    for (let i = 0; i < buffer.length; i++) {
      // Look for text markers in PDF
      if (buffer[i] === 66 && buffer[i+1] === 84) { // BT - Begin Text
        inTextObject = true;
        i += 2;
      } else if (buffer[i] === 69 && buffer[i+1] === 84) { // ET - End Text
        inTextObject = false;
        text += currentText + ' ';
        currentText = '';
        i += 2;
      } else if (inTextObject) {
        // Extract printable ASCII characters
        if (buffer[i] >= 32 && buffer[i] <= 126) {
          currentText += String.fromCharCode(buffer[i]);
        }
      }
    }
    
    // Clean up the extracted text
    text = text.replace(/[^\x20-\x7E\n]/g, ' ')  // Remove non-printable characters
              .replace(/\s+/g, ' ')              // Replace multiple spaces with a single space
              .trim();
    
    // If extracted text is too short or empty, it probably failed
    if (text.length < 50) {
      console.warn('Simple PDF text extraction produced limited results. Using more robust fallback.');
      
      // Include a placeholder message about the extraction limitation
      return `[This PDF contains text that couldn't be fully extracted. Please provide key details from the resume manually if needed.]\n\n${text}`;
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '[Unable to extract text from this PDF. The file may be image-based or secured.]';
  }
}

/**
 * Extract text from DOCX file using mammoth
 */
export async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Extract text from DOC file - more challenging, using a simplified approach
 * Note: For a real app, consider using a more robust solution like textract
 */
export async function extractTextFromDOC(filePath: string): Promise<string> {
  try {
    const buffer = await readFile(filePath);
    
    // Extract printable characters and attempt to organize into coherent text
    let text = '';
    let inTextBlock = false;
    let blockText = '';
    
    // Microsoft Word DOC format has text blocks with certain patterns
    for (let i = 0; i < buffer.length; i++) {
      // Check for potential text block markers (very simplified)
      if (i > 2 && 
          buffer[i-2] === 0x00 && 
          buffer[i-1] === 0x00 && 
          buffer[i] >= 32 && buffer[i] <= 126) {
        inTextBlock = true;
      }
      
      // End of potential text block
      if (inTextBlock && 
          (i+2 < buffer.length) && 
          buffer[i] === 0x00 && 
          buffer[i+1] === 0x00 && 
          buffer[i+2] === 0x00) {
        inTextBlock = false;
        if (blockText.length > 5) {  // Only add blocks with reasonable content
          text += blockText + '\n';
        }
        blockText = '';
      }
      
      // Extract ASCII characters within text blocks
      if (inTextBlock && buffer[i] >= 32 && buffer[i] <= 126) {
        blockText += String.fromCharCode(buffer[i]);
      }
    }
    
    // Clean up the text
    text = text.replace(/[^\x20-\x7E\n]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
    
    // If we couldn't extract much text, provide a helpful message
    if (text.length < 50) {
      return '[The DOC file format could not be fully parsed. Please convert your resume to PDF or DOCX format for better results.]\n\n' + text;
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from DOC:', error);
    return '[Unable to extract text from this DOC file. Please try converting it to PDF or DOCX format.]';
  }
}

/**
 * Process resume file and extract text based on file type
 */
export async function processResumeFile(filePath: string): Promise<string> {
  const fileExt = path.extname(filePath).toLowerCase();
  
  try {
    let text = '';
    
    // Process based on file extension
    switch (fileExt) {
      case '.pdf':
        text = await extractTextFromPDF(filePath);
        break;
      case '.docx':
        try {
          text = await extractTextFromDOCX(filePath);
        } catch (error) {
          console.error('DOCX processing error:', error);
          text = '[There was a problem processing this DOCX file. The file may be corrupted or password-protected.]';
        }
        break;
      case '.doc':
        text = await extractTextFromDOC(filePath);
        break;
      default:
        text = '[Unsupported file format. Please upload a PDF, DOC, or DOCX file.]';
    }
    
    // Clean up temporary file after processing
    try {
      await unlink(filePath);
    } catch (e) {
      console.warn('Failed to delete temporary file:', filePath);
    }
    
    // Ensure we always return some text, even if extraction failed
    if (!text || text.trim().length === 0) {
      return '[Unable to extract text from this file. The file may be empty, corrupted, or in an unsupported format.]';
    }
    
    return text;
  } catch (error) {
    // Clean up temp file even if there's an error
    try {
      await unlink(filePath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    console.error('Resume processing error:', error);
    return '[An error occurred while processing your resume. Please try uploading a different file or format.]';
  }
}
