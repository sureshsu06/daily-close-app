export interface AccrualEntry {
  entryId: string;
  date: string;
  description: string;
  amount: number;
  type: 'Recurring' | 'PO issued' | 'Monthly expense';
  category: string;
  status: 'pending' | 'complete' | 'review' | 'exception';
  vendor: string;
  reference: string;
  expectedDate?: string;
  lastAccrualDate?: string;
  notes?: string;
  preparedBy?: string;
  reviewedBy?: string;
  attachments?: string[];
}

export interface AccrualSummary {
  totalAccruals: number;
  totalAmount: number;
  pendingCount: number;
  reviewCount: number;
  exceptionCount: number;
  lastUpdated: string;
}

export interface AccrualFilter {
  status?: string;
  type?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
} 