export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'needs_attention' | 'ongoing';
  assignedTo: 'human' | 'pip';
  category: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface FinancialArea {
  id: string;
  name: string;
  tasks: Task[];
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface BankTransaction {
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'cleared' | 'review' | 'exception';
  checkNumber?: string;
  customerName?: string;
  glAccountMatched?: boolean;
  exceptionReason?: string;
  clearingDeadline?: string;
  creditLimit?: number;
  currentBalance?: number;
  glAccount?: string;
}

export interface GLEntry {
  entryId: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  accountNumber: string;
  reference: string;
  matchedBankTransaction?: string;
  status: 'cleared' | 'review' | 'exception';
}

export interface ReconciliationSummary {
  totalDebits: number;
  totalCredits: number;
  unmatchedGLEntries: number;
  unmatchedBankTransactions: number;
  pendingChecks: number;
  exceptionsCount: number;
} 