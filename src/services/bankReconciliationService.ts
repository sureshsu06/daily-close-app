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

// Helper to generate a random integer between -3 and 3, excluding 0, but now including 0 to 3 only (positive or negative)
function randomDayGap() {
  // Returns a random integer between -3 and 3, excluding 0
  let gap = 0;
  while (gap === 0) {
    gap = Math.floor(Math.random() * 7) - 3; // -3 to +3
  }
  return gap;
}

function randomGap0to3() {
  // Returns a random integer between 0 and 3, can be positive or negative
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * Math.floor(Math.random() * 4); // 0, 1, 2, or 3
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Helper function to generate transaction pairs
const generateTransactionPair = (
  index: number,
  type: 'vendor_payment' | 'bank_fee' | 'customer_payment'
): { bank?: BankTransaction; gl?: GLEntry } => {
  const id = (index + 1).toString().padStart(2, '0');
  const baseDate = new Date(`2024-03-${(index % 30) + 1}`.padStart(10, '0'));
  const gap = randomGap0to3();
  const glDate = baseDate;
  const bankDate = new Date(baseDate);
  bankDate.setDate(baseDate.getDate() + gap);

  // Vendor transactions with exact amounts
  const vendorTransactions: { gl: Transaction; bank: Transaction }[] = [
    {
      gl: { description: 'Office rent payment - 123 Business Ave', amount: 4500.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ACH DEBIT - BUILDING MGMT LLC - RENT PMT REF#230984', amount: 4500.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'AWS Cloud Services - Monthly hosting', amount: 1876, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'AMZN AWS CLOUD PMT 1876.50 USD ACH', amount: 1876.50, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Staples - Office supplies and printer cartridges', amount: 439.97, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'POS DEBIT - VISA STAPLES #1234 - PURCHASE 439.97 USD', amount: 439.97, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'ADP Payroll - Bi-weekly payroll processing', amount: 12750.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ACH DEBIT - ADP PAYROLL FEES - REF#8294731', amount: 12750.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Hartford Insurance - Monthly premium', amount: 2150.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ACH WTH HARTFORD INS PREM 2150.00 USD', amount: 2150.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'PG&E - Utility payment', amount: 543.21, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'BILL PAY - PG&E UTILITY 543.21 USD REF#73629', amount: 543.21, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Google Ads - Marketing campaign Mar 2024', amount: 2750.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'GOOGLE*ADS CC PMT ACH 2750.00 USD', amount: 2750.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Salesforce - Annual subscription renewal', amount: 15000.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ACH DEBIT SALESFORCE.COM SUBSCRIPTION PMT', amount: 15000.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Deloitte - Q1 2024 Consulting services', amount: 7500.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'WIRE TRANSFER - DELOITTE & TOUCHE REF#982364', amount: 7500.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Adobe Creative Cloud - Team subscription', amount: 479.88, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ADOBE CREATIVE CLD PMT 479.88 USD ACH', amount: 479.88, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'AT&T - Business phone and internet', amount: 389.99, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ATT*BILL PAYMENT 389.99 ACH DEBIT', amount: 389.99, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'WeWork - Conference room booking', amount: 899.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'WEWORK*OFFICE SPACE PMT - REF#762198', amount: 899.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'QuickBooks - Monthly subscription', amount: 150.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'INTUIT*QB ONLINE 150.00 USD DEBIT', amount: 150.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Home Depot - Office maintenance supplies', amount: 287.64, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'HOME DEPOT #4738 PURCHASE 287.64 USD', amount: 287.64, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Dell - Laptop purchase IT dept', amount: 2399.98, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'DELL COMPUTERS ORDER#DX89234 2399.98', amount: 2399.98, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Zoom - Annual video conferencing', amount: 1800.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ZOOM.US PAYMENT ACH PMT 1800.00 USD', amount: 1800.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Uber for Business - Employee travel', amount: 320.45, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'UBER TRIP BUSINESS 320.45 USD', amount: 320.45, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'FedEx - Shipping charges', amount: 128.90, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'FEDEX SHIP CHARGE 128.90 USD', amount: 128.90, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'LinkedIn - Job posting', amount: 499.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'LINKEDIN JOB POST 499.00 USD', amount: 499.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Slack - Team communication subscription', amount: 240.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'SLACK*SUBSCRIPTION 240.00 USD', amount: 240.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Dropbox - Cloud storage renewal', amount: 199.99, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'DROPBOX*RENEWAL 199.99 USD', amount: 199.99, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'IKEA - Office furniture', amount: 1345.67, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'IKEA FURNITURE 1345.67 USD', amount: 1345.67, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Costco - Bulk office snacks', amount: 215.30, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'COSTCO SNACKS 215.30 USD', amount: 215.30, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Apple - iPad for sales team', amount: 799.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'APPLE STORE IPAD 799.00 USD', amount: 799.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Blue Apron - Team lunch catering', amount: 350.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'BLUE APRON LUNCH 350.00 USD', amount: 350.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Expedia - Conference travel booking', amount: 2200.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'EXPEDIA TRAVEL 2200.00 USD', amount: 2200.00, type: 'debit', date: formatDate(bankDate) }
    }
  ];

  // Bank fee transactions with exact amounts
  const bankFeeTransactions: { gl: Transaction; bank: Transaction }[] = [
    {
      gl: { description: 'Monthly account maintenance fee', amount: 25.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'MONTHLY MAINTENANCE FEE', amount: 25.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Wire transfer fee', amount: 35.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'WIRE TRANSFER FEE REF#982364', amount: 35.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'ACH processing fee', amount: 15.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'ACH ORIG RETURN FEE', amount: 15.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Check processing fee', amount: 20.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'CHECK IMAGE ACCESS FEE', amount: 20.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'International transaction fee', amount: 45.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'INTL TRANSACTION SERVICE CHARGE', amount: 45.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Overdraft protection fee', amount: 35.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'OVERDRAFT ITEM FEE', amount: 35.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Stop payment fee', amount: 30.00, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'STOP PAYMENT CHARGE', amount: 30.00, type: 'debit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Service fee', amount: 350, type: 'debit', date: formatDate(glDate) },
      bank: { description: 'NON-CHASE FEE-WITH', amount: 350, type: 'debit', date: formatDate(bankDate) }
    }
  ];

  // Customer payment transactions with exact amounts
  const customerTransactions: { gl: Transaction; bank: Transaction }[] = [
    {
      gl: { description: 'Customer payment - Invoice #INV-2024-1234', amount: 5750.00, type: 'credit', date: formatDate(glDate) },
      bank: { description: 'DEPOSIT - ACH CREDIT ACME CORP INV1234', amount: 5750.00, type: 'credit', date: formatDate(bankDate) }
    },
    {
      gl: { description: 'Customer deposit - Contract #CON-2024-5678', amount: 8500.00, type: 'credit', date: formatDate(glDate) },
      bank: { description: 'INCOMING WIRE - GLOBAL TECH LLC REF#763421', amount: 8500.00, type: 'credit', date: formatDate(bankDate) }
    }
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
      date: transaction.bank.date,
      description: transaction.bank.description,
      amount: transaction.bank.amount,
      type: transaction.bank.type,
      status: 'cleared',
      checkNumber: `10${id}`,
      glAccountMatched: true,
      glAccount: `${1000 + index}`
    };
    result.bank = bankEntry;

    result.gl = {
      entryId: `GL${id}`,
      date: transaction.gl.date,
      description: transaction.gl.description,
      amount: transaction.gl.amount,
      type: transaction.gl.type,
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
      date: transaction.bank.date,
      description: transaction.bank.description,
      amount: transaction.bank.amount,
      type: transaction.bank.type,
      status: 'review',
      glAccountMatched: false
    };
  }
  // For customer payments, create only GL entry
  else if (type === 'customer_payment') {
    result.gl = {
      entryId: `GL${id}`,
      date: transaction.gl.date,
      description: transaction.gl.description,
      amount: transaction.gl.amount,
      type: transaction.gl.type,
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

  // Example: Bank transaction matched to two GL entries
  const multiGLBankTransaction = {
    transactionId: 'BT100',
    date: '2024-04-10',
    description: 'Acme Corp ACH#125',
    amount: 3000,
    type: 'credit' as 'credit',
    status: 'cleared' as 'cleared',
    checkNumber: '2001',
    glAccountMatched: true,
    glAccount: '2101, 2102',
    matchedGLEntries: ['GL201', 'GL202']
  };

  transactions.push(multiGLBankTransaction);

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

  // In getMockGLEntries, after generating other entries, add:
  const multiGL1 = {
    entryId: 'GL201',
    date: '2024-04-10',
    description: 'Invoice #INV-1001',
    amount: 1500,
    type: 'credit' as 'credit',
    accountNumber: '2101',
    reference: 'INV1001',
    matchedBankTransaction: 'BT100',
    status: 'cleared' as 'cleared'
  };
  const multiGL2 = {
    entryId: 'GL202',
    date: '2024-04-10',
    description: 'Invoice #INV-1002',
    amount: 1500,
    type: 'credit' as 'credit',
    accountNumber: '2102',
    reference: 'INV1002',
    matchedBankTransaction: 'BT100',
    status: 'cleared' as 'cleared'
  };

  entries.push(multiGL1, multiGL2);

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