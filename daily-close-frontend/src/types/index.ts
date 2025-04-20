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

export interface PnLData {
  date: string;
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  netIncome: number;
  details?: {
    [key: string]: number;
  };
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
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
} 