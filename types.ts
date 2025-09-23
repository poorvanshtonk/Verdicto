export interface ExtractedClause {
  clauseTitle: string;
  clauseText: string;
}

export interface LegalSummary {
  title: string;
  summary: string;
  benefits: string[];
  risks:string[];
  authoritiesGranted: string[];
  extractedClauses: ExtractedClause[];
}

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    sources?: Source[];
}

export interface User {
  fullName: string;
  username: string;
  age: number;
  email: string;
  bio: string;
  role: 'owner' | 'admin' | 'member';
  plan: 'free' | 'pro' | 'enterprise';
  credits?: number;
}

export interface SavedDocument {
    fileName: string;
    summary: LegalSummary;
    documentText: string;
    savedAt: string;
    notes?: string;
    docType: string;
    jurisdiction: string;
}

export interface StoredUser extends User {
  password: string;
  workspacePassword?: string;
  workspaceHint?: string;
  savedDocuments?: SavedDocument[];
}
