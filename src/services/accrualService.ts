import { AccrualEntry, AccrualSummary } from '../types/accrual';

// Mock data for development
const mockAccruals: AccrualEntry[] = [
  {
    entryId: 'ACC001',
    date: '2024-03-15',
    description: 'Office Rent',
    amount: 12000,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'ABC Properties',
    reference: 'RENT-2024-03',
    notes: 'Fixed monthly rent payment due on the 1st',
  },
  {
    entryId: 'ACC002',
    date: '2024-03-15',
    description: 'Legal Retainer Fees',
    amount: 5000,
    type: 'Monthly expense',
    category: 'Expense',
    status: 'pending',
    vendor: 'Smith & Associates',
    reference: 'LEGAL-2024-03',
    notes: 'Monthly legal services - amount varies based on usage',
  },
  {
    entryId: 'ACC003',
    date: '2024-03-15',
    description: 'IT Support Services',
    amount: 3500,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'TechCare Solutions',
    reference: 'IT-2024-03',
    notes: 'Fixed monthly IT support contract',
  },
  {
    entryId: 'ACC004',
    date: '2024-03-15',
    description: 'Utilities - Electricity',
    amount: 2800,
    type: 'Monthly expense',
    category: 'Expense',
    status: 'pending',
    vendor: 'Power Corp',
    reference: 'UTIL-2024-03',
    notes: 'Monthly electricity charges - varies seasonally',
  },
  {
    entryId: 'ACC005',
    date: '2024-03-15',
    description: 'Office Cleaning Services',
    amount: 1500,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'CleanPro Services',
    reference: 'CLEAN-2024-03',
    notes: 'Fixed monthly cleaning contract',
  },
  {
    entryId: 'ACC006',
    date: '2024-03-15',
    description: 'Software Licenses',
    amount: 7500,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'Various Software Vendors',
    reference: 'SW-2024-03',
    notes: 'Monthly software subscription fees',
  },
  {
    entryId: 'ACC007',
    date: '2024-03-15',
    description: 'Marketing Services',
    amount: 8500,
    type: 'Monthly expense',
    category: 'Expense',
    status: 'pending',
    vendor: 'Digital Marketing Pro',
    reference: 'MKT-2024-03',
    notes: 'Monthly marketing services - varies based on campaigns',
  },
  {
    entryId: 'ACC008',
    date: '2024-03-15',
    description: 'Security Services',
    amount: 2200,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'SecureGuard Inc',
    reference: 'SEC-2024-03',
    notes: 'Fixed monthly security services contract',
  },
  {
    entryId: 'ACC009',
    date: '2024-03-15',
    description: 'Internet & Telecom',
    amount: 1800,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'TeleNet Services',
    reference: 'TEL-2024-03',
    notes: 'Fixed monthly internet and phone services',
  },
  {
    entryId: 'ACC010',
    date: '2024-03-15',
    description: 'Professional Training',
    amount: 4500,
    type: 'Monthly expense',
    category: 'Expense',
    status: 'pending',
    vendor: 'Various Training Providers',
    reference: 'TRN-2024-03',
    notes: 'Monthly employee training costs - varies by programs',
  },
  {
    entryId: 'ACC011',
    date: '2024-03-15',
    description: 'Insurance Premium',
    amount: 3200,
    type: 'Recurring',
    category: 'Expense',
    status: 'pending',
    vendor: 'Business Insurers Co',
    reference: 'INS-2024-03',
    notes: 'Fixed monthly business insurance premium',
  },
  {
    entryId: 'ACC012',
    date: '2024-03-15',
    description: 'Maintenance Services',
    amount: 1900,
    type: 'Monthly expense',
    category: 'Expense',
    status: 'pending',
    vendor: 'Facility Maintenance Co',
    reference: 'MAINT-2024-03',
    notes: 'Monthly building maintenance - varies based on repairs needed',
  }
];

export const fetchAccruals = async (taskContext?: boolean): Promise<AccrualEntry[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    const filteredAccruals = taskContext 
      ? mockAccruals.filter(acc => acc.category === 'Expense')
      : mockAccruals;
    setTimeout(() => resolve(filteredAccruals), 500);
  });
};

export const getAccrualSummary = async (taskContext?: boolean): Promise<AccrualSummary> => {
  const accruals = await fetchAccruals(taskContext);
  return {
    totalAccruals: accruals.length,
    totalAmount: accruals.reduce((sum, acc) => sum + acc.amount, 0),
    pendingCount: accruals.filter(acc => acc.status === 'pending').length,
    reviewCount: accruals.filter(acc => acc.status === 'review').length,
    exceptionCount: accruals.filter(acc => acc.status === 'exception').length,
    lastUpdated: new Date().toISOString(),
  };
};

export const updateAccrualStatus = async (
  entryId: string,
  status: AccrualEntry['status']
): Promise<AccrualEntry> => {
  // Simulate API call
  return new Promise((resolve) => {
    const updatedAccrual = mockAccruals.find(acc => acc.entryId === entryId);
    if (updatedAccrual) {
      updatedAccrual.status = status;
    }
    setTimeout(() => resolve(updatedAccrual!), 500);
  });
};

export const createAccrual = async (accrual: Omit<AccrualEntry, 'entryId'>): Promise<AccrualEntry> => {
  // Simulate API call
  return new Promise((resolve) => {
    const newAccrual: AccrualEntry = {
      ...accrual,
      entryId: `ACC${mockAccruals.length + 1}`.padStart(6, '0'),
    };
    mockAccruals.push(newAccrual);
    setTimeout(() => resolve(newAccrual), 500);
  });
};

export const updateAccrual = async (accrual: AccrualEntry): Promise<AccrualEntry> => {
  // Simulate API call
  return new Promise((resolve) => {
    const index = mockAccruals.findIndex(acc => acc.entryId === accrual.entryId);
    if (index !== -1) {
      mockAccruals[index] = accrual;
    }
    setTimeout(() => resolve(accrual), 500);
  });
}; 