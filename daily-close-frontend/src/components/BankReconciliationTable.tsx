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
    fontSize: '13px',
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
    fontSize: '13px',
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
  width: '700px',
  '& .highlight': {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

interface StyledTableRowProps {
  highlighted?: boolean;
}

const StyledTableRow = styled(TableRow)<StyledTableRowProps>(({ theme, highlighted }) => ({
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
}));

const SmallButton = styled(Button)(({ theme }) => ({
  fontSize: '13px',
  padding: '6px 12px',
  height: '32px',
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
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
  const [showUpload, setShowUpload] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial GL entries only
    const entries = getMockGLEntries();
    setGLEntries(entries);
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, we would process the CSV file here
    // For now, we'll just simulate loading the bank transactions
    const transactions = getMockBankTransactions();
    setBankTransactions(transactions);
    setSummary(getReconciliationSummary(transactions, glEntries));
    setShowUpload(false);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  if (showUpload) {
    return (
      <Box>
        {/* Top Section with Filter and Toggle */}
        <Box sx={{ 
          display: 'flex',
          gap: 3,
          mb: 3,
        }}>
          {/* Left side with Filter */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 2 }}>
              <StyledFormControl>
                <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as TransactionStatus | 'all')}
                  label="Filter by Status"
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="cleared">Matched</MenuItem>
                  <MenuItem value="review">For Review</MenuItem>
                  <MenuItem value="exception">Exceptions</MenuItem>
                </Select>
              </StyledFormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ViewToggle
                value={viewType}
                exclusive
                onChange={(_, newValue) => newValue && setViewType(newValue)}
                aria-label="view type"
              >
                <ToggleButton 
                  value="bank" 
                  onClick={showUpload ? () => fileInputRef.current?.click() : undefined}
                >
                  {showUpload && <CloudUpload sx={{ fontSize: 18 }} />}
                  Bank
                </ToggleButton>
                <ToggleButton value="gl">GL</ToggleButton>
              </ViewToggle>

              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Box>
          </Box>

          {/* Right side Summary Text */}
          <SummaryText>
            Viewing GL entries. Upload bank statement to start reconciliation process.
          </SummaryText>
        </Box>

        <StyledTableContainer ref={tableContainerRef}>
          <Paper>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <HeaderCell sx={{ width: '100px' }}>Date</HeaderCell>
                  <HeaderCell sx={{ width: '35%' }}>Description</HeaderCell>
                  <HeaderCell sx={{ width: '100px' }} align="right">Amount</HeaderCell>
                  <HeaderCell sx={{ width: '60px' }}>Type</HeaderCell>
                  <HeaderCell sx={{ width: '100px' }}>Status</HeaderCell>
                  <HeaderCell sx={{ width: '100px' }}>Account</HeaderCell>
                  <HeaderCell sx={{ width: '100px' }}>Reference</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                  <TableCell>-</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${getTotalAmount(glEntries).toLocaleString()}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </StyledTableRow>
                {glEntries.map((entry) => (
                  <StyledTableRow
                    key={entry.entryId}
                    data-entry-id={entry.entryId}
                  >
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell align="right">${entry.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatTransactionType(entry.type)}</TableCell>
                    <TableCell>
                      <StatusChip
                        icon={getStatusIcon(entry.status as TransactionStatus)}
                        label={entry.status}
                        status={entry.status as TransactionStatus}
                      />
                    </TableCell>
                    <TableCell>{entry.accountNumber}</TableCell>
                    <TableCell>{entry.reference}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </StyledTableContainer>
      </Box>
    );
  }

  if (!summary) {
    return <Typography>Loading...</Typography>;
  }

  const counts = getTransactionCounts();
  const stats = getReconciliationStats();

  return (
    <Box>
      {/* Top Section with Filter, Toggle, and Summary */}
      <Box sx={{ 
        display: 'flex',
        gap: 3,
        mb: 3,
      }}>
        {/* Left side with Filter and Toggle */}
        <Box sx={{ flex: 1 }}>
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
                <MenuItem value="all">All Transactions</MenuItem>
                <MenuItem value="cleared">Matched</MenuItem>
                <MenuItem value="review">For Review</MenuItem>
                <MenuItem value="exception">Exceptions</MenuItem>
              </Select>
            </StyledFormControl>
          </Box>

          <ViewToggle
            value={viewType}
            exclusive
            onChange={(_, newValue) => newValue && setViewType(newValue)}
            aria-label="view type"
          >
            <ToggleButton 
              value="bank" 
              onClick={showUpload ? () => fileInputRef.current?.click() : undefined}
            >
              {showUpload && <CloudUpload sx={{ fontSize: 18 }} />}
              Bank
            </ToggleButton>
            <ToggleButton value="gl">GL</ToggleButton>
          </ViewToggle>
        </Box>

        {/* Right side Summary Text */}
        <SummaryText>
          The bank reconciliation process has processed <span className="highlight">{stats.totalTransactions} transactions</span> with a total value of <span className="highlight">${stats.totalAmount}</span>, achieving a robust <span className="highlight">{stats.matchRate}% match rate</span>. Currently monitoring <span className="highlight">{stats.reviewTransactions} transactions</span> for review and <span className="highlight">{stats.exceptionTransactions} exceptions</span> requiring immediate attention. 
        </SummaryText>
      </Box>

      {summary.exceptionsCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          There are {summary.exceptionsCount} transactions that require attention
        </Alert>
      )}

      <StyledTableContainer ref={tableContainerRef}>
        <Paper>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <HeaderCell sx={{ width: '100px' }}>Date</HeaderCell>
                <HeaderCell sx={{ width: '35%' }}>Description</HeaderCell>
                <HeaderCell sx={{ width: '100px' }} align="right">Amount</HeaderCell>
                <HeaderCell sx={{ width: '60px' }}>Type</HeaderCell>
                <HeaderCell sx={{ width: '100px' }}>Status</HeaderCell>
                {viewType === 'bank' && (
                  <>
                    <HeaderCell sx={{ width: '80px' }}>Ref #</HeaderCell>
                    <HeaderCell sx={{ width: '80px' }} align="center">GL</HeaderCell>
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
                <>
                  <StyledTableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                    <TableCell>-</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${getTotalAmount(filteredTransactions).toLocaleString()}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell align="right">-</TableCell>
                  </StyledTableRow>
                  {filteredTransactions.map((transaction) => (
                    <StyledTableRow
                      key={transaction.transactionId}
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
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
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
                      <TableCell align="right">
                        {transaction.glAccountMatched ? (
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
                  ))}
                </>
              ) : (
                <>
                  <StyledTableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                    <TableCell>-</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${getTotalAmount(filteredGLEntries).toLocaleString()}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </StyledTableRow>
                  {filteredGLEntries.map((entry) => (
                    <StyledTableRow
                      key={entry.entryId}
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
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
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
                  ))}
                </>
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