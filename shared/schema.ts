import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type KeywordMatch = 'Great' | 'Good' | 'Partial' | 'Missing';

export interface KeywordDensity {
  keyword: string;
  jobCount: number;
  resumeCount: number;
  match: KeywordMatch;
}

export interface KeywordAnalysis {
  found: string[];
  missing: string[];
  partial: string[];
  density: KeywordDensity[];
}

export interface KeyFinding {
  text: string;
  type: 'positive' | 'negative';
}

export interface DetailedFeedback {
  overall: string;
  skills: string;
  experience: string;
  education: string;
  format: string;
  summaryRevision?: {
    current: string;
    improved: string;
  };
}

export interface AnalysisResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  formatScore: number;
  keyFindings: KeyFinding[];
  keywordAnalysis: KeywordAnalysis;
  detailedFeedback: DetailedFeedback;
  timestamp: number;
}

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description").notNull(),
  result: jsonb("result").$type<AnalysisResult>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).pick({
  resumeText: true,
  jobDescription: true,
  result: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
