import { users, type User, type InsertUser, type Analysis, type InsertAnalysis, analyses } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAllAnalyses(): Promise<Analysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analysesData: Map<number, Analysis>;
  private userCurrentId: number;
  private analysisCurrentId: number;

  constructor() {
    this.users = new Map();
    this.analysesData = new Map();
    this.userCurrentId = 1;
    this.analysisCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.analysisCurrentId++;
    const createdAt = new Date();
    const analysis: Analysis = { ...insertAnalysis, id, createdAt };
    this.analysesData.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    return this.analysesData.get(id);
  }

  async getAllAnalyses(): Promise<Analysis[]> {
    return Array.from(this.analysesData.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
