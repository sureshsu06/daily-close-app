import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Theme,
  Button,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudUpload,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { BankTransaction, GLEntry, ReconciliationSummary } from '../types';
import {
  getMockBankTransactions,
  getMockGLEntries,
  getReconciliationSummary,
  matchTransaction,
} from '../services/bankReconciliationService';
import { TransactionAnalysisModal } from './TransactionAnalysisModal';

type TransactionStatus = 'cleared' | 'review' | 'exception';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 300px)',
  marginTop: theme.spacing(2),
}));

const StatusChip = styled(Chip)<{ status: TransactionStatus }>(({ theme, status }) => {
  const colors = {
    cleared: theme.palette.success.main,
    review: theme.palette.warning.main,
    exception: theme.palette.error.main,
  };
  return {
    backgroundColor: 'transparent',
    color: colors[status],
    height: '24px',
    justifyContent: 'flex-start',
    padding: 0,
    border: 'none',
    '& .MuiChip-label': {
      padding: 0,
      paddingLeft: 4,
      fontSize: '13px',
    },
    '& .MuiChip-icon': {
      marginLeft: 0,
      marginRight: 4,
      width: 16,
      height: 16,
    },
  };
});

const CountChip = styled(Chip)(({ theme }) => ({
  borderRadius: '4px',
  height: '24px',
  fontSize: '13px',
  fontWeight: 500,
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(1),
  '& .MuiChip-label': {
    padding: '0 8px',
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginTop: theme.spacing(1.2),
  padding: 0,
  '& .MuiOutlinedInput-root': {
    height: '40px',
    fontSize: '15px',
    backgroundColor: '#fff',
    margin: 0,
    '& .MuiSelect-select': {
      padding: '8px 14px',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '13px',
    transform: 'translate(14px, 12px) scale(1)',
    '&.Mui-focused, &.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#fff',
      padding: '0 4px',
    },
  },
  '& .MuiMenuItem-root': {
    fontSize: '12px',
    padding: '6px 14px',
    height: '32px'
  },
  '& .MuiList-root': {
    padding: '4px 0'
  }
}));

const ViewToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  marginTop: theme.spacing(0.1),
  '& .MuiToggleButton-root': {
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 24px',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const SummaryText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  maxWidth: '700px',
  marginLeft: theme.spacing(4),
  flex: '1 1 auto',
  '& .highlight': {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

interface StyledTableRowProps {
  highlighted?: boolean;
}

const StyledTableRow = styled(TableRow)<StyledTableRowProps>(({ theme, highlighted }) => ({
  '&:not(:last-child) td, &:not(:last-child) th': {
    borderBottom: '1px solid #eee',
  },
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  ...(highlighted && {
    backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
  })
}));

const GLLink = styled('button')(({ theme }) => ({
  fontSize: '13px',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: 'nowrap',
  padding: '16px 8px',
  fontWeight: 600,
  fontSize: '13px',
  '&.date-column': {
    textAlign: 'left !important'
  }
}));

const DateCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  padding: '16px 8px',
}));

const SmallButton = styled(Button)(({ theme }) => ({
  fontSize: '13px',
  padding: '6px 12px',
  height: '32px',
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
}));

const SummaryTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: '8px',
    borderBottom: 'none',
  },
  '& .MuiTableRow-root': {
    backgroundColor: '#fff',
  },
  '& .MuiTableHead-root .MuiTableRow-root': {
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      paddingBottom: '8px',
    }
  },
  '& .MuiTableBody-root .MuiTableRow-root:first-of-type': {
    '& .MuiTableCell-root': {
      paddingTop: '12px',
    }
  },
  '& .summary-label': {
    fontWeight: 600,
    fontSize: '13px',
  },
  '& .summary-value': {
    fontSize: '13px',
    textAlign: 'right',
  },
  '& .subcategory': {
    paddingLeft: theme.spacing(4),
  }
}));

const ExpandButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.text.primary,
  minWidth: 0,
  '&:hover': {
    opacity: 0.7,
  },
}));

interface BankReconciliationTableProps {
  onExceptionFound?: (transaction: BankTransaction) => void;
}

export const BankReconciliationTable: React.FC<BankReconciliationTableProps> = ({
  onExceptionFound,
}) => {
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [glEntries, setGLEntries] = useState<GLEntry[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TransactionStatus | 'all'>('all');
  const [viewType, setViewType] = useState<'bank' | 'gl'>('gl');
  const [highlightedGLEntry, setHighlightedGLEntry] = useState<string | null>(null);
  const [highlightedBankTransaction, setHighlightedBankTransaction] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | GLEntry | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [awsExpand, setAwsExpand] = useState(false);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial data
    const entries = getMockGLEntries();
    const transactions = getMockBankTransactions().map(transaction => ({
      ...transaction,
      status: transaction.status === 'review' ? 'exception' : transaction.status
    }));
    setGLEntries(entries);
    setBankTransactions(transactions);
    setSummary(getReconciliationSummary(transactions, entries));
  }, []);

  useEffect(() => {
    // Scroll to highlighted row when it changes
    if (tableContainerRef.current) {
      let highlightedRow: Element | null = null;
      
      if (viewType === 'gl' && highlightedGLEntry) {
        highlightedRow = tableContainerRef.current.querySelector(`[data-entry-id="${highlightedGLEntry}"]`);
      } else if (viewType === 'bank' && highlightedBankTransaction) {
        highlightedRow = tableContainerRef.current.querySelector(`[data-transaction-id="${highlightedBankTransaction}"]`);
      }

      if (highlightedRow) {
        setTimeout(() => {
          highlightedRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [highlightedGLEntry, highlightedBankTransaction, viewType]);

  const handleMatch = (bankTransactionId: string, glEntryId: string) => {
    const result = matchTransaction(bankTransactionId, glEntryId, bankTransactions, glEntries);
    setBankTransactions(result.bankTransactions);
    setGLEntries(result.glEntries);
    setSummary(getReconciliationSummary(result.bankTransactions, result.glEntries));
  };

  const handleGLClick = (glEntryId: string) => {
    setViewType('gl');
    setHighlightedGLEntry(glEntryId);
    setHighlightedBankTransaction(null);
  };

  const handleBankClick = (bankTransactionId: string) => {
    setViewType('bank');
    setHighlightedBankTransaction(bankTransactionId);
    setHighlightedGLEntry(null);
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'cleared':
        return <CheckCircleIcon color="success" />;
      case 'review':
        return <WarningIcon color="warning" />;
      case 'exception':
        return <ErrorIcon color="error" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

  const formatTransactionType = (type: 'debit' | 'credit') => {
    return type === 'debit' ? 'dr.' : 'cr.';
  };

  const filteredTransactions = bankTransactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.status === selectedFilter;
  });

  const filteredGLEntries = glEntries.filter(entry => {
    if (selectedFilter === 'all') return true;
    return entry.status === selectedFilter;
  });

  const getTransactionCounts = () => {
    if (viewType === 'bank') {
      return {
        total: bankTransactions.length,
        matched: bankTransactions.filter(t => t.glAccountMatched).length,
        unmatched: bankTransactions.filter(t => !t.glAccountMatched).length
      };
    } else {
      return {
        total: glEntries.length,
        matched: glEntries.filter(e => e.matchedBankTransaction).length,
        unmatched: glEntries.filter(e => !e.matchedBankTransaction).length
      };
    }
  };

  const getReconciliationStats = () => {
    const totalTransactions = bankTransactions.length;
    const matchedTransactions = bankTransactions.filter(t => t.glAccountMatched).length;
    const matchRate = Math.round((matchedTransactions / totalTransactions) * 100);
    const reviewTransactions = bankTransactions.filter(t => t.status === 'review').length;
    
    // Count exceptions from both bank transactions and GL entries
    const bankExceptions = bankTransactions.filter(t => t.status === 'exception').length;
    const glExceptions = glEntries.filter(e => e.status === 'exception').length;
    const exceptionTransactions = bankExceptions + glExceptions;
    
    const totalAmount = bankTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions,
      matchRate,
      reviewTransactions,
      exceptionTransactions,
      totalAmount: totalAmount.toLocaleString()
    };
  };

  const getTotalAmount = (items: (BankTransaction | GLEntry)[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleTransactionClick = (transaction: BankTransaction | GLEntry) => {
    if (transaction.status === 'review' || transaction.status === 'exception') {
      setSelectedTransaction(transaction);
      setIsAnalysisModalOpen(true);
    }
  };

  const isTransactionWithStatus = (status: TransactionStatus) => (t: BankTransaction | GLEntry) => t.status === status;

  const getFilteredAmount = (
    items: (BankTransaction | GLEntry)[],
    status: TransactionStatus
  ): number => {
    return getTotalAmount(items.filter(item => item.status === status));
  };

  const getPercentage = (amount: number, total: number): string => {
    return total === 0 ? '0%' : `${((amount / total) * 100).toFixed(1)}%`;
  };

  const getFilterSummary = (
    transactions: (BankTransaction | GLEntry)[],
    filter: TransactionStatus | 'all',
    viewType: 'bank' | 'gl'
  ): string => {
    const totalValue = getTotalAmount(transactions);
    const clearedValue = getFilteredAmount(transactions, 'cleared');
    const reviewValue = getFilteredAmount(transactions, 'review');
    const exceptionValue = getFilteredAmount(transactions, 'exception');
    
    const formatAmount = (amount: number) => `$${amount.toLocaleString()}`;
    const formatPercentage = (amount: number) => `${((amount / totalValue) * 100).toFixed(1)}%`;
    const viewTypeLabel = viewType === 'bank' ? 'bank transactions' : 'GL entries';

    const getMaterialityAnalysis = () => {
      const unmatched = reviewValue + exceptionValue;
      const unmatchedPercent = ((unmatched / totalValue) * 100);
      
      if (unmatchedPercent <= 5) {
        return `Discrepancies are not material (${formatPercentage(unmatched)} of total value).`;
      } else if (unmatchedPercent <= 15) {
        return `Timing differences and pending items account for ${formatPercentage(reviewValue)} of transactions, with ${formatPercentage(exceptionValue)} requiring investigation.`;
      } else {
        return `Significant reconciliation needed with ${formatPercentage(unmatched)} of transactions unmatched, primarily due to timing differences and pending classifications.`;
      }
    };

    switch (filter) {
      case 'cleared':
        return `Matched ${viewTypeLabel} total ${formatAmount(clearedValue)}, representing ${formatPercentage(clearedValue)} of total value. ${getMaterialityAnalysis()}`;
      case 'review':
        return `${viewTypeLabel} under review total ${formatAmount(reviewValue)} (${formatPercentage(reviewValue)} of total value), primarily due to timing differences and pending classifications. Most items are expected to clear in the next cycle.`;
      case 'exception':
        return `Exception ${viewTypeLabel} total ${formatAmount(exceptionValue)} (${formatPercentage(exceptionValue)} of total value), requiring immediate investigation. These items represent potential misclassifications or unusual transactions.`;
      default:
        return `Of ${formatAmount(totalValue)} in ${viewTypeLabel}, ${formatPercentage(clearedValue)} is matched while ${formatPercentage(reviewValue + exceptionValue)} requires attention. ${getMaterialityAnalysis()}`;
    }
  };

  // Helper to detect the AWS $0.5 difference row
  const isAwsDiffRow = (transaction: BankTransaction) => {
    const matchingEntry = glEntries.find(
      entry => entry.matchedBankTransaction === transaction.transactionId
    );
    return (
      transaction.description === 'AMZN AWS CLOUD PMT 1876.50 USD ACH' &&
      matchingEntry &&
      matchingEntry.description === 'AWS Cloud Services - Monthly hosting' &&
      Math.abs((matchingEntry.amount || 0) - (transaction.amount || 0)) === 0.5
    );
  };

  // Helper to detect the AWS $0.5 difference row for GL
  const isAwsDiffRowGL = (entry: GLEntry) => {
    const matchingBank = bankTransactions.find(
      t => t.transactionId === entry.matchedBankTransaction
    );
    return (
      entry.description === 'AWS Cloud Services - Monthly hosting' &&
      matchingBank &&
      matchingBank.description === 'AMZN AWS CLOUD PMT 1876.50 USD ACH' &&
      Math.abs((entry.amount || 0) - (matchingBank.amount || 0)) === 0.5
    );
  };

  if (!summary) {
    return <Typography>Loading...</Typography>;
  }

  const counts = getTransactionCounts();
  const stats = getReconciliationStats();

  // Add a CSS class for smaller dropdown items
  const dropdownMenuItemStyle = `<style>.dropdown-menu-item { font-size: 12px !important; }</style>`;
  if (typeof document !== 'undefined' && !document.getElementById('dropdown-menu-item-style')) {
    const style = document.createElement('style');
    style.id = 'dropdown-menu-item-style';
    style.innerHTML = `.dropdown-menu-item { font-size: 13px !important; }`;
    document.head.appendChild(style);
  }

  return (
    <Box>
      {/* Top Section with Filter, Toggle, and Summary */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'flex-start',
        mb: 3,
      }}>
        {/* Left side with Filter and Toggle */}
        <Box sx={{ minWidth: '250px' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            mb: 2,
          }}>
            <StyledFormControl>
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as TransactionStatus | 'all')}
                label="Filter by Status"
              >
                <MenuItem value="all" className="dropdown-menu-item">All Transactions</MenuItem>
                <MenuItem value="cleared" className="dropdown-menu-item">Matched</MenuItem>
                <MenuItem value="review" className="dropdown-menu-item">For Review</MenuItem>
                <MenuItem value="exception" className="dropdown-menu-item">Exceptions</MenuItem>
              </Select>
            </StyledFormControl>
          </Box>

          <ViewToggle
            value={viewType}
            exclusive
            onChange={(_, newValue) => newValue && setViewType(newValue)}
            aria-label="view type"
          >
            <ToggleButton value="bank">Bank</ToggleButton>
            <ToggleButton value="gl">GL</ToggleButton>
          </ViewToggle>
        </Box>

        {/* Right side Summary Text */}
        <SummaryText>
          {getFilterSummary(
            viewType === 'bank' ? filteredTransactions : filteredGLEntries,
            selectedFilter,
            viewType
          )}
        </SummaryText>
      </Box>

      {(bankTransactions.filter(t => t.status === 'exception').length + 
        glEntries.filter(e => e.status === 'exception').length) > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          There are {bankTransactions.filter(t => t.status === 'exception').length + 
          glEntries.filter(e => e.status === 'exception').length} transactions that require attention
        </Alert>
      )}

      <Paper sx={{ mb: 2 }}>
        <SummaryTable>
          <TableHead>
            <TableRow>
              <HeaderCell sx={{ width: '45%' }}>Category</HeaderCell>
              <HeaderCell sx={{ width: '100px', paddingRight: '24px' }} align="right">Value</HeaderCell>
              <HeaderCell sx={{ width: '60px' }} align="right">%</HeaderCell>
              <HeaderCell sx={{ width: '60px' }}></HeaderCell>
              {viewType === 'bank' ? (
                <>
                  <HeaderCell sx={{ width: '80px' }}></HeaderCell>
                  <HeaderCell sx={{ width: '80px' }}></HeaderCell>
                </>
              ) : (
                <>
                  <HeaderCell sx={{ width: '100px' }}></HeaderCell>
                  <HeaderCell sx={{ width: '100px' }}></HeaderCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Total row */}
            <TableRow>
              <TableCell className="summary-label">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ExpandButton onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                    {isSummaryExpanded ? (
                      <ExpandMoreIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <ChevronRightIcon sx={{ fontSize: 20 }} />
                    )}
                  </ExpandButton>
                  Total Transactions
                </Box>
              </TableCell>
              <TableCell className="summary-value" sx={{ paddingRight: '24px' }}>
                ${getTotalAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries).toLocaleString()}
              </TableCell>
              <TableCell className="summary-value">100%</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            {isSummaryExpanded && (
              <>
                {/* Cleared row */}
                <TableRow>
                  <TableCell className="summary-label subcategory">Cleared</TableCell>
                  <TableCell className="summary-value" sx={{ paddingRight: '24px' }}>
                    ${getFilteredAmount(
                      viewType === 'bank' ? filteredTransactions : filteredGLEntries,
                      'cleared'
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="summary-value">
                    {getPercentage(
                      getFilteredAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries, 'cleared'),
                      getTotalAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries)
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>

                {/* For Review row */}
                <TableRow>
                  <TableCell className="summary-label subcategory">For Review</TableCell>
                  <TableCell className="summary-value" sx={{ paddingRight: '24px' }}>
                    ${getFilteredAmount(
                      viewType === 'bank' ? filteredTransactions : filteredGLEntries,
                      'review'
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="summary-value">
                    {getPercentage(
                      getFilteredAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries, 'review'),
                      getTotalAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries)
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>

                {/* Exceptions row */}
                <TableRow>
                  <TableCell className="summary-label subcategory">Exceptions</TableCell>
                  <TableCell className="summary-value" sx={{ paddingRight: '24px' }}>
                    ${getFilteredAmount(
                      viewType === 'bank' ? filteredTransactions : filteredGLEntries,
                      'exception'
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="summary-value">
                    {getPercentage(
                      getFilteredAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries, 'exception'),
                      getTotalAmount(viewType === 'bank' ? filteredTransactions : filteredGLEntries)
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </SummaryTable>
      </Paper>

      <StyledTableContainer ref={tableContainerRef}>
        <Paper>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <HeaderCell sx={{ width: '24px', minWidth: '24px', maxWidth: '24px', padding: 0, textAlign: 'center' }}></HeaderCell>
                <HeaderCell sx={{ width: '100px', textAlign: 'left !important' }}>Date</HeaderCell>
                <HeaderCell sx={{ width: '35%' }}>Description</HeaderCell>
                <HeaderCell sx={{ width: '100px' }} align="right">Amount</HeaderCell>
                <HeaderCell sx={{ width: '60px' }}>Type</HeaderCell>
                <HeaderCell sx={{ width: '100px' }}>Status</HeaderCell>
                {viewType === 'bank' && (
                  <>
                    <HeaderCell sx={{ width: '80px' }}>Ref #</HeaderCell>
                    <HeaderCell sx={{ width: '120px' }} align="center">GL</HeaderCell>
                  </>
                )}
                {viewType === 'gl' && (
                  <>
                    <HeaderCell sx={{ width: '100px' }}>Account</HeaderCell>
                    <HeaderCell sx={{ width: '100px' }}>Reference</HeaderCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {viewType === 'bank' ? (
                filteredTransactions.map((transaction) => {
                  const awsDiff = isAwsDiffRow(transaction);
                  return (
                    <React.Fragment key={transaction.transactionId}>
                      <StyledTableRow
                        highlighted={transaction.transactionId === highlightedBankTransaction}
                        data-transaction-id={transaction.transactionId}
                        onClick={() => handleTransactionClick(transaction)}
                        sx={{
                          backgroundColor:
                            transaction.status === 'exception' ? 'error.lighter' : 'inherit',
                          cursor: transaction.status === 'review' || transaction.status === 'exception' 
                            ? 'pointer' 
                            : 'default',
                          '&:hover': {
                            backgroundColor: transaction.status === 'review' || transaction.status === 'exception'
                              ? 'rgba(0, 0, 0, 0.04)'
                              : 'inherit',
                          },
                        }}
                      >
                        <TableCell sx={{ width: '24px', minWidth: '24px', maxWidth: '24px', padding: 0, textAlign: 'center' }}>
                          {awsDiff && (
                            <ExpandButton
                              onClick={e => {
                                e.stopPropagation();
                                setAwsExpand(val => !val);
                              }}
                              style={{ color: 'red' }}
                              aria-label="expand AWS diff row"
                            >
                              {awsExpand ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                            </ExpandButton>
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left !important' }}>{transaction.date}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{transaction.description}</TableCell>
                        <TableCell align="right">
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{formatTransactionType(transaction.type)}</TableCell>
                        <TableCell>
                          <StatusChip
                            icon={getStatusIcon(transaction.status as TransactionStatus)}
                            label={transaction.status}
                            status={transaction.status}
                          />
                        </TableCell>
                        <TableCell>{transaction.checkNumber || transaction.transactionId}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap', maxWidth: 140 }}>
                          {Array.isArray(transaction.matchedGLEntries) && transaction.matchedGLEntries?.length > 1 ? (
                            transaction.matchedGLEntries.map((glId, idx) => {
                              const matchingEntry = glEntries.find(entry => entry.entryId === glId);
                              return (
                                <React.Fragment key={glId}>
                                  <GLLink
                                    style={{ display: 'inline' }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      if (matchingEntry) handleGLClick(matchingEntry.entryId);
                                    }}
                                  >
                                    {matchingEntry ? matchingEntry.accountNumber : glId}
                                  </GLLink>
                                  {idx < (transaction.matchedGLEntries?.length ?? 0) - 1 && ', '}
                                </React.Fragment>
                              );
                            })
                          ) : transaction.glAccountMatched ? (
                            <GLLink
                              onClick={() => {
                                const matchingEntry = glEntries.find(
                                  entry => entry.matchedBankTransaction === transaction.transactionId
                                );
                                if (matchingEntry) {
                                  handleGLClick(matchingEntry.entryId);
                                }
                              }}
                            >
                              {transaction.glAccount}
                            </GLLink>
                          ) : '-'}
                        </TableCell>
                      </StyledTableRow>
                      {awsDiff && awsExpand && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Box sx={{ color: 'grey', fontWeight: 300, pl: 6, py: 1, fontStyle: 'italic' }}>
                              $0.5 difference b/w GL and bank. Recommend passing adjusting entry. Not material.
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                filteredGLEntries.map((entry) => {
                  const awsDiffGL = isAwsDiffRowGL(entry);
                  return (
                    <React.Fragment key={entry.entryId}>
                      <StyledTableRow
                        highlighted={entry.entryId === highlightedGLEntry}
                        data-entry-id={entry.entryId}
                        onClick={() => handleTransactionClick(entry)}
                        sx={{
                          cursor: entry.status === 'review' || entry.status === 'exception' 
                            ? 'pointer' 
                            : 'default',
                          '&:hover': {
                            backgroundColor: entry.status === 'review' || entry.status === 'exception'
                              ? 'rgba(0, 0, 0, 0.04)'
                              : 'inherit',
                          },
                        }}
                      >
                        <TableCell sx={{ width: '24px', minWidth: '24px', maxWidth: '24px', padding: 0, textAlign: 'center' }}>
                          {awsDiffGL && (
                            <ExpandButton
                              onClick={e => {
                                e.stopPropagation();
                                setAwsExpand(val => !val);
                              }}
                              style={{ color: 'red' }}
                              aria-label="expand AWS diff row GL"
                            >
                              {awsExpand ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                            </ExpandButton>
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left !important' }}>{entry.date}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{entry.description}</TableCell>
                        <TableCell align="right">
                          ${entry.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{formatTransactionType(entry.type)}</TableCell>
                        <TableCell>
                          <StatusChip
                            icon={getStatusIcon(entry.status as TransactionStatus)}
                            label={entry.status}
                            status={entry.status}
                          />
                        </TableCell>
                        <TableCell>{entry.accountNumber}</TableCell>
                        <TableCell>
                          {entry.matchedBankTransaction && entry.status === 'cleared' ? (
                            <GLLink
                              onClick={() => handleBankClick(entry.matchedBankTransaction!)}
                            >
                              {entry.reference}
                            </GLLink>
                          ) : entry.reference}
                        </TableCell>
                      </StyledTableRow>
                      {awsDiffGL && awsExpand && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Box sx={{ color: 'grey', fontWeight: 300, pl: 6, py: 1, fontStyle: 'italic' }}>
                              $0.5 difference b/w GL and bank. Recommend passing adjusting entry
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>
      </StyledTableContainer>

      <TransactionAnalysisModal
        open={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </Box>
  );
}; 