import { BankTransaction, GLEntry, ReconciliationSummary } from '../types';

type TransactionType = 'debit' | 'credit';
type TransactionStatus = 'cleared' | 'review' | 'exception';

interface Transaction {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

const fixedTransactions: Transaction[] = [
  { description: 'AWS Cloud Services', amount: 10.39, type: 'credit', date: '2024-03-01' },
  { description: 'Monthly rent payment', amount: 68.23, type: 'debit', date: '2024-03-02' },
  { description: 'Credit card processing fees', amount: 93.80, type: 'credit', date: '2024-03-03' },
  { description: 'Office supplies', amount: 45.67, type: 'debit', date: '2024-03-04' },
  { description: 'Internet service', amount: 89.99, type: 'credit', date: '2024-03-05' }
];

// Helper function to generate transaction pairs
const generateTransactionPair = (
  index: number,
  type: 'vendor_payment' | 'bank_fee' | 'customer_payment'
): { bank?: BankTransaction; gl?: GLEntry } => {
  const id = (index + 1).toString().padStart(2, '0');
  const date = `2024-03-${(index % 30) + 1}`.padStart(10, '0');

  // Vendor transactions with exact amounts
  const vendorTransactions: Transaction[] = [
    { description: 'Office rent payment - 123 Business Ave', amount: 4500.00, type: 'debit', date },
    { description: 'AWS Cloud Services - Monthly hosting', amount: 1876.50, type: 'debit', date },
    { description: 'Staples - Office supplies and printer cartridges', amount: 439.97, type: 'debit', date },
    { description: 'ADP Payroll - Bi-weekly payroll processing', amount: 12750.00, type: 'debit', date },
    { description: 'Hartford Insurance - Monthly premium', amount: 2150.00, type: 'debit', date },
    { description: 'PG&E - Utility payment', amount: 543.21, type: 'debit', date },
    { description: 'Google Ads - Marketing campaign Mar 2024', amount: 2750.00, type: 'debit', date },
    { description: 'Salesforce - Annual subscription renewal', amount: 15000.00, type: 'debit', date },
    { description: 'Deloitte - Q1 2024 Consulting services', amount: 7500.00, type: 'debit', date },
    { description: 'Adobe Creative Cloud - Team subscription', amount: 479.88, type: 'debit', date },
    { description: 'AT&T - Business phone and internet', amount: 389.99, type: 'debit', date },
    { description: 'WeWork - Conference room booking', amount: 899.00, type: 'debit', date },
    { description: 'QuickBooks - Monthly subscription', amount: 150.00, type: 'debit', date },
    { description: 'Home Depot - Office maintenance supplies', amount: 287.64, type: 'debit', date },
    { description: 'Dell - Laptop purchase IT dept', amount: 2399.98, type: 'debit', date },
    { description: 'Zoom - Annual video conferencing', amount: 1800.00, type: 'debit', date }
  ];

  // Bank fee transactions with exact amounts
  const bankFeeTransactions: Transaction[] = [
    { description: 'Monthly account maintenance fee', amount: 25.00, type: 'debit', date },
    { description: 'Wire transfer fee', amount: 35.00, type: 'debit', date },
    { description: 'ACH processing fee', amount: 15.00, type: 'debit', date },
    { description: 'Check processing fee', amount: 20.00, type: 'debit', date },
    { description: 'International transaction fee', amount: 45.00, type: 'debit', date },
    { description: 'Overdraft protection fee', amount: 35.00, type: 'debit', date },
    { description: 'Stop payment fee', amount: 30.00, type: 'debit', date },
    { description: 'ATM service fee', amount: 3.50, type: 'debit', date }
  ];

  // Customer payment transactions with exact amounts
  const customerTransactions: Transaction[] = [
    { description: 'Customer payment - Invoice #INV-2024-1234', amount: 5750.00, type: 'credit', date },
    { description: 'Customer deposit - Contract #CON-2024-5678', amount: 8500.00, type: 'credit', date }
  ];

  let transaction;
  switch (type) {
    case 'vendor_payment':
      transaction = vendorTransactions[index % vendorTransactions.length];
      break;
    case 'bank_fee':
      transaction = bankFeeTransactions[index % bankFeeTransactions.length];
      break;
    case 'customer_payment':
      transaction = customerTransactions[index % customerTransactions.length];
      break;
  }

  if (!transaction) {
    return {};
  }

  const result: { bank?: BankTransaction; gl?: GLEntry } = {};

  // For vendor payments, create both bank and GL entries
  if (type === 'vendor_payment') {
    const bankEntry: BankTransaction = {
      transactionId: `BT${id}`,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      status: 'cleared',
      checkNumber: `10${id}`,
      glAccountMatched: true,
      glAccount: `${1000 + index}`
    };
    result.bank = bankEntry;

    result.gl = {
      entryId: `GL${id}`,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      accountNumber: `${1000 + index}`,
      reference: bankEntry.checkNumber || `REF${id}`,
      matchedBankTransaction: `BT${id}`,
      status: 'cleared'
    };
  }
  // For bank fees, create only bank entry
  else if (type === 'bank_fee') {
    result.bank = {
      transactionId: `BT${id}`,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      status: 'review',
      glAccountMatched: false
    };
  }
  // For customer payments, create only GL entry
  else if (type === 'customer_payment') {
    result.gl = {
      entryId: `GL${id}`,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      accountNumber: `${2000 + index}`,
      reference: `INV${id}`,
      status: 'exception'
    };
  }

  return result;
};

// Mock data for bank transactions
export const getMockBankTransactions = (): BankTransaction[] => {
  const transactions: BankTransaction[] = [];
  
  // Generate 40 matched vendor transactions
  for (let i = 0; i < 40; i++) {
    const pair = generateTransactionPair(i, 'vendor_payment');
    if (pair.bank) transactions.push(pair.bank);
  }

  // Generate 8 bank fee transactions (for review)
  for (let i = 40; i < 48; i++) {
    const pair = generateTransactionPair(i, 'bank_fee');
    if (pair.bank) transactions.push(pair.bank);
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock data for GL entries
export const getMockGLEntries = (): GLEntry[] => {
  const entries: GLEntry[] = [];
  
  // Generate 40 matched vendor transactions
  for (let i = 0; i < 40; i++) {
    const pair = generateTransactionPair(i, 'vendor_payment');
    if (pair.gl) entries.push(pair.gl);
  }

  // Generate 2 customer payment exceptions
  for (let i = 48; i < 50; i++) {
    const pair = generateTransactionPair(i, 'customer_payment');
    if (pair.gl) entries.push(pair.gl);
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock data for bank reconciliation
export const getBankReconciliationData = (): {
  bankTransactions: BankTransaction[];
  glEntries: GLEntry[];
} => {
  const bankTransactions: BankTransaction[] = [];
  const glEntries: GLEntry[] = [];

  // Generate vendor payment transactions (both bank and GL)
  for (let i = 0; i < 16; i++) {
    const { bank, gl } = generateTransactionPair(i, 'vendor_payment');
    if (bank) bankTransactions.push(bank);
    if (gl) glEntries.push(gl);
  }

  // Generate bank fee transactions (bank only)
  for (let i = 0; i < 8; i++) {
    const { bank } = generateTransactionPair(i, 'bank_fee');
    if (bank) bankTransactions.push(bank);
  }

  // Generate customer payment transactions (GL only)
  for (let i = 0; i < 2; i++) {
    const { gl } = generateTransactionPair(i, 'customer_payment');
    if (gl) glEntries.push(gl);
  }

  return {
    bankTransactions,
    glEntries
  };
};

// Calculate reconciliation summary
export const getReconciliationSummary = (
  bankTransactions: BankTransaction[],
  glEntries: GLEntry[]
): ReconciliationSummary => {
  const totalDebits = bankTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalCredits = bankTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const unmatchedBankTransactions = bankTransactions
    .filter(t => !t.glAccountMatched).length;

  const unmatchedGLEntries = glEntries
    .filter(e => !e.matchedBankTransaction).length;

  const pendingChecks = bankTransactions
    .filter(t => t.checkNumber && t.status !== 'cleared').length;

  const exceptionsCount = bankTransactions
    .filter(t => t.status === 'exception').length;

  return {
    totalDebits,
    totalCredits,
    unmatchedGLEntries,
    unmatchedBankTransactions,
    pendingChecks,
    exceptionsCount
  };
};

// Match a bank transaction with a GL entry
export const matchTransaction = (
  bankTransactionId: string,
  glEntryId: string,
  bankTransactions: BankTransaction[],
  glEntries: GLEntry[]
): { bankTransactions: BankTransaction[]; glEntries: GLEntry[] } => {
  const bankTransaction = bankTransactions.find(t => t.transactionId === bankTransactionId);
  const glEntry = glEntries.find(e => e.entryId === glEntryId);

  if (!bankTransaction || !glEntry) {
    return { bankTransactions, glEntries };
  }

  const updatedBankTransactions = bankTransactions.map(t =>
    t.transactionId === bankTransactionId
      ? {
          ...t,
          glAccountMatched: true,
          glAccount: glEntry.accountNumber,
          status: 'cleared' as TransactionStatus
        }
      : t
  );

  const updatedGLEntries = glEntries.map(e =>
    e.entryId === glEntryId
      ? {
          ...e,
          matchedBankTransaction: bankTransactionId,
          status: 'cleared' as TransactionStatus
        }
      : e
  );

  return {
    bankTransactions: updatedBankTransactions,
    glEntries: updatedGLEntries
  };
}; 