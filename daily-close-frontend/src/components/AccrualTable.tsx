import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  styled,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AccrualEntry, AccrualSummary, AccrualFilter } from '../types/accrual';
import { fetchAccruals, getAccrualSummary, createAccrual, updateAccrual } from '../services/accrualService';
import { AccrualModal } from './AccrualModal';
import StatusSelector from '../components/StatusSelector';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 300px)',
  marginTop: theme.spacing(2),
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const colors = {
    complete: theme.palette.success.main,
    pending: theme.palette.info.main,
    review: theme.palette.warning.main,
    exception: theme.palette.error.main,
  };
  return {
    backgroundColor: 'transparent',
    color: colors[status as keyof typeof colors],
    height: '24px',
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginRight: theme.spacing(2),
}));

const SummaryText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  '& .highlight': {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

const FilterLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

const FilterSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#fff',
  width: '200px',
  '& .MuiSelect-select': {
    padding: '12px 16px',
    fontSize: '13px'
  },
  '& .MuiMenuItem-root': {
    fontSize: '13px'
  }
}));

interface AccrualTableProps {
  taskContext?: boolean;
}

interface EditableTableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  type?: string;
}

const EditableTableCell: React.FC<EditableTableCellProps> = ({
  value,
  isEditing,
  onChange,
  onSave,
  onCancel,
  type = 'text'
}) => {
  if (!isEditing) {
    return <StyledTableCell>{value}</StyledTableCell>;
  }

  return (
    <StyledTableCell sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          autoFocus
          fullWidth
          variant="outlined"
          sx={{ backgroundColor: 'white' }}
        />
        <IconButton size="small" onClick={onSave} color="primary">
          <SaveIcon />
        </IconButton>
        <IconButton size="small" onClick={onCancel} color="error">
          <CloseIcon />
        </IconButton>
      </Box>
    </StyledTableCell>
  );
};

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  accrual: AccrualEntry;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose, accrual }) => {
  // Mock historical data based on the actual expense
  const getHistoricalData = () => {
    const baseAmount = accrual.amount;
    const today = new Date();
    return [
      {
        date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString().split('T')[0],
        amount: accrual.type === 'Recurring' ? baseAmount : baseAmount * (0.9 + Math.random() * 0.2),
        status: 'complete'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString().split('T')[0],
        amount: accrual.type === 'Recurring' ? baseAmount : baseAmount * (0.9 + Math.random() * 0.2),
        status: 'complete'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 3, 15).toISOString().split('T')[0],
        amount: accrual.type === 'Recurring' ? baseAmount : baseAmount * (0.9 + Math.random() * 0.2),
        status: 'complete'
      }
    ];
  };

  const history = getHistoricalData();
  const avgAmount = history.reduce((sum, h) => sum + Number(h.amount), 0) / history.length;
  const variance = Math.max(...history.map(h => Number(h.amount))) - Math.min(...history.map(h => Number(h.amount)));
  
  const recommendation = {
    amount: accrual.type === 'Recurring' ? accrual.amount : Math.round(avgAmount),
    confidence: accrual.type === 'Recurring' ? 'High' : (variance < avgAmount * 0.1 ? 'High' : 'Medium'),
    reason: accrual.type === 'Recurring' 
      ? 'Fixed monthly amount based on contract'
      : `Based on 3-month average of $${Math.round(avgAmount).toLocaleString()}`
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>History & Recommendations - {accrual.description}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Recommendation Section */}
          <Typography variant="h6" gutterBottom>Recommended Accrual</Typography>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1" gutterBottom>
              Amount: <strong>${recommendation.amount.toLocaleString()}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Confidence: <strong>{recommendation.confidence}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recommendation.reason}
            </Typography>
          </Box>

          {/* History Section */}
          <Typography variant="h6" gutterBottom>Past 3 Months History</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell align="right">${Number(record.amount).toLocaleString()}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const AccrualTable: React.FC<AccrualTableProps> = ({ taskContext = false }) => {
  const [accruals, setAccruals] = useState<AccrualEntry[]>([]);
  const [summary, setSummary] = useState<AccrualSummary | null>(null);
  const [filter, setFilter] = useState<AccrualFilter>({
    type: taskContext ? 'Monthly expense' : '',
    category: taskContext ? 'Expense' : '',
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccrual, setSelectedAccrual] = useState<AccrualEntry | undefined>(undefined);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const handleAddAccrual = () => {
    setSelectedAccrual(undefined);
    setIsModalOpen(true);
  };

  const handleEditAccrual = (accrual: AccrualEntry) => {
    setSelectedAccrual(accrual);
    setIsModalOpen(true);
  };

  const handleSaveAccrual = async (accrual: Omit<AccrualEntry, 'entryId'>) => {
    try {
      const newAccrual = await createAccrual({
        ...accrual,
        category: taskContext ? 'Expense' : accrual.category,
      });
      setAccruals([...accruals, newAccrual]);
      const summaryData = await getAccrualSummary(taskContext);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error saving accrual:', error);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setFilter({ ...filter, status: newStatus });
  };

  const handleShowHistory = (accrual: AccrualEntry) => {
    setSelectedAccrual(accrual);
    setHistoryModalOpen(true);
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load accruals and summary
        const [accrualData, summaryData] = await Promise.all([
          fetchAccruals(taskContext),
          getAccrualSummary(taskContext),
        ]);
        
        console.log('Loaded accruals:', accrualData); // Debug log
        setAccruals(accrualData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error loading accrual data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskContext]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton size="small" color="success">
              <CheckCircleIcon />
            </IconButton>
          </Box>
        );
      case 'pending':
        return 'Pending';
      case 'review':
        return 'In Review';
      case 'exception':
        return 'Exception';
      default:
        return status;
    }
  };

  const filteredAccruals = accruals.filter(accrual => {
    if (filter.status && accrual.status !== filter.status) return false;
    if (filter.type && accrual.type !== filter.type) return false;
    if (filter.category && accrual.category !== filter.category) return false;
    return true;
  });

  // Calculate recommendations for all accruals
  const getRecommendations = () => {
    const recurring = accruals.filter(a => a.type === 'Recurring');
    const variable = accruals.filter(a => a.type === 'Monthly expense');
    const totalRecommended = recurring.reduce((sum, a) => sum + a.amount, 0) + 
      variable.reduce((sum, a) => sum + a.amount, 0);
    
    return {
      recurring: recurring.length,
      variable: variable.length,
      totalRecommended,
      highConfidence: recurring.length + variable.filter(a => a.amount > 1000).length,
    };
  };

  const recommendations = accruals.length ? getRecommendations() : null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Typography>Loading accruals...</Typography>
      </Box>
    );
  }

  if (!accruals.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
        <Typography variant="h6">No accruals found</Typography>
      </Box>
    );
  }

  const hasExceptions = summary?.exceptionCount && summary.exceptionCount > 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Monthly Business Expenses</Typography>
        
        {recommendations && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Based on historical patterns, we recommend accruing {recommendations.recurring} recurring expenses 
              (fixed amounts) and {recommendations.variable} variable expenses this month. 
              {recommendations.highConfidence > 0 && ` ${recommendations.highConfidence} of these recommendations have high confidence based on consistent past activity.`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The total recommended accrual amount is <strong>${recommendations.totalRecommended.toLocaleString()}</strong>.
              Click the history icon on any expense to see detailed recommendations and past activity.
            </Typography>
          </Box>
        )}

        {summary && (
          <SummaryText sx={{ mt: 3 }}>
            Showing <span className="highlight">{filteredAccruals.length}</span> monthly expenses 
            with a total value of <span className="highlight">${summary.totalAmount.toLocaleString()}</span>. 
            {summary.reviewCount > 0 && (
              <span> There are <span className="highlight">{summary.reviewCount}</span> items for review.</span>
            )}
          </SummaryText>
        )}

        {hasExceptions && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            There are {summary?.exceptionCount} expenses that require immediate attention
          </Alert>
        )}
      </Box>

      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <HeaderCell>Date</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Vendor</HeaderCell>
              <HeaderCell align="right">Amount</HeaderCell>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Reference</HeaderCell>
              <HeaderCell align="center">History</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Total Row */}
            <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
              <TableCell>-</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total Monthly Expenses</TableCell>
              <TableCell>-</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${filteredAccruals.reduce((sum, acc) => sum + acc.amount, 0).toLocaleString()}
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            {filteredAccruals.map((accrual) => (
              <TableRow
                key={accrual.entryId}
                sx={{
                  backgroundColor: accrual.type === 'Recurring' ? '#f0f7f0' : 'inherit',
                  '&:hover': { 
                    backgroundColor: accrual.type === 'Recurring' ? '#e6f2e6' : '#f5f5f5' 
                  },
                }}
              >
                <StyledTableCell>{accrual.date}</StyledTableCell>
                <StyledTableCell>{accrual.description}</StyledTableCell>
                <StyledTableCell>{accrual.vendor}</StyledTableCell>
                <StyledTableCell align="right">${accrual.amount.toLocaleString()}</StyledTableCell>
                <StyledTableCell>
                  <Chip 
                    label={accrual.type}
                    size="small"
                    color={accrual.type === 'Recurring' ? 'success' : 'primary'}
                    variant="outlined"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  {getStatusDisplay(accrual.status)}
                </StyledTableCell>
                <StyledTableCell>{accrual.reference}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton 
                    size="small" 
                    onClick={() => handleShowHistory(accrual)}
                    title="View History & Recommendations"
                  >
                    <HistoryIcon />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <AccrualModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccrual}
        accrual={selectedAccrual}
        taskContext={taskContext}
      />

      {selectedAccrual && (
        <HistoryModal
          open={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          accrual={selectedAccrual}
        />
      )}
    </Box>
  );
}; 