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
  Tooltip,
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
  AttachFile as AttachFileIcon,
  Email as EmailIcon,
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
        status: 'complete',
        attachmentType: 'file',
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString().split('T')[0],
        amount: accrual.type === 'Recurring' ? baseAmount : baseAmount * (0.9 + Math.random() * 0.2),
        status: 'complete',
        attachmentType: 'email',
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 3, 15).toISOString().split('T')[0],
        amount: accrual.type === 'Recurring' ? baseAmount : baseAmount * (0.9 + Math.random() * 0.2),
        status: 'complete',
        attachmentType: null,
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
      <DialogTitle>Accruals Working - {accrual.description}</DialogTitle>
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
                <TableCell>Attachment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell align="right">${Number(record.amount).toLocaleString()}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>
                    {record.attachmentType === 'file' && (
                      <Tooltip title="File Attachment">
                        <AttachFileIcon fontSize="small" />
                      </Tooltip>
                    )}
                    {record.attachmentType === 'email' && (
                      <Tooltip title="Email Attachment">
                        <EmailIcon fontSize="small" />
                      </Tooltip>
                    )}
                  </TableCell>
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

  const filteredAccruals = accruals.filter(accrual => {
    if (filter.status && accrual.status !== filter.status) return false;
    if (filter.type && accrual.type !== filter.type) return false;
    if (filter.category && accrual.category !== filter.category) return false;
    return true;
  });

  const recommendations = React.useMemo(() => {
    if (loading || !filteredAccruals.length) return null;
    
    const recurring = filteredAccruals.filter(a => a.type === 'Recurring');
    const variable = filteredAccruals.filter(a => a.type === 'Monthly expense');
    const totalRecommended = filteredAccruals.reduce((sum, a) => sum + a.amount, 0);
    
    return {
      recurring: recurring.length,
      variable: variable.length,
      totalRecommended,
      highConfidence: recurring.length + variable.filter(a => a.amount > 1000).length,
    };
  }, [filteredAccruals, loading]);

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
        // MOCK DATA START
        const accrualData: AccrualEntry[] = [
          { entryId: 'ACC001', date: '2024-03-15', description: 'Legal Retainer Fees', vendor: 'Smith & Associates', amount: 5000, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'LEGAL-2024-03', confidence: 0.95 },
          { entryId: 'ACC002', date: '2024-03-15', description: 'Utilities - Electricity', vendor: 'Power Corp', amount: 2800, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'UTIL-2024-03', confidence: 0.85 },
          { entryId: 'ACC003', date: '2024-03-15', description: 'Marketing Services', vendor: 'Digital Marketing Pro', amount: 8500, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'MKT-2024-03', confidence: 0.92 },
          { entryId: 'ACC004', date: '2024-03-15', description: 'Professional Training', vendor: 'Various Training Providers', amount: 4500, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'TRN-2024-03', confidence: 0.88 },
          { entryId: 'ACC005', date: '2024-03-15', description: 'Maintenance Services', vendor: 'Facility Maintenance Co', amount: 1900, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'MAINT-2024-03', confidence: 0.80 },
          { entryId: 'ACC006', date: '2024-03-15', description: 'Cloud Hosting', vendor: 'AWS', amount: 3200, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'CLOUD-2024-03', confidence: 0.90 },
          { entryId: 'ACC007', date: '2024-03-15', description: 'Software Subscriptions', vendor: 'SaaS Solutions', amount: 2100, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'SAAS-2024-03', confidence: 0.93 },
          { entryId: 'ACC008', date: '2024-03-15', description: 'Security Services', vendor: 'SecureIT', amount: 1700, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'SEC-2024-03', confidence: 0.82 },
          { entryId: 'ACC009', date: '2024-03-15', description: 'Office Cleaning', vendor: 'CleanCo', amount: 1200, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'CLEAN-2024-03', confidence: 0.87 },
          { entryId: 'ACC010', date: '2024-03-15', description: 'IT Support', vendor: 'TechAssist', amount: 2600, status: 'pending', type: 'Monthly expense', category: 'Expense', reference: 'IT-2024-03', confidence: 0.89 },
        ];
        // MOCK DATA END
        // const [accrualData, summaryData] = await Promise.all([
        //   fetchAccruals(taskContext),
        //   getAccrualSummary(taskContext),
        // ]);
        setAccruals(accrualData);
        setSummary({
          totalAccruals: accrualData.length,
          totalAmount: accrualData.reduce((sum, acc) => sum + acc.amount, 0),
          pendingCount: accrualData.filter(acc => acc.status === 'pending').length,
          reviewCount: accrualData.filter(acc => acc.status === 'review').length,
          exceptionCount: accrualData.filter(acc => acc.status === 'exception').length,
          lastUpdated: new Date().toISOString(),
        });
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography variant="h6" color="text.secondary">Loading accruals...</Typography>
      </Box>
    );
  }

  if (!accruals.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
        <Typography variant="h6" color="text.secondary">No accruals found</Typography>
      </Box>
    );
  }

  const hasExceptions = summary?.exceptionCount && summary.exceptionCount > 0;

  return (
    <Box>
      {recommendations && (
        <Box component="div" sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            There are {recommendations.recurring} recurring and {recommendations.variable} variable service expenses that need to be reviewed for accruals. The total recommended accrual amount is ${recommendations.totalRecommended.toLocaleString()}.
            
            Of these recommendations, {recommendations.highConfidence} are of high confidence, given the historical data and past variance. For the others, we recommend checking with the vendors to confirm the amount to be accrued.

          </Typography>
          {hasExceptions && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              There are {summary?.exceptionCount} expenses that require immediate attention
            </Alert>
          )}
        </Box>
      )}

      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <HeaderCell>Date</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Vendor</HeaderCell>
              <HeaderCell align="right">Estimated Accrual</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Confidence</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Total Row */}
            <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
              <TableCell>-</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Services Monthly Accruals</TableCell>
              <TableCell>-</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${filteredAccruals.reduce((sum, acc) => sum + acc.amount, 0).toLocaleString()}
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            {filteredAccruals.map((accrual, idx) => (
              <TableRow
                key={accrual.entryId || idx}
                onClick={() => handleShowHistory(accrual)}
                sx={{
                  backgroundColor: accrual.type === 'Recurring' ? '#f0f7f0' : 'inherit',
                  '&:hover': { 
                    backgroundColor: accrual.type === 'Recurring' ? '#e6f2e6' : '#f5f5f5',
                    cursor: 'pointer'
                  },
                }}
              >
                <StyledTableCell>{accrual.date}</StyledTableCell>
                <StyledTableCell>{accrual.description}</StyledTableCell>
                <StyledTableCell>{accrual.vendor}</StyledTableCell>
                <StyledTableCell align="right">${accrual.amount.toLocaleString()}</StyledTableCell>
                <StyledTableCell align="center">
                  {getStatusDisplay(accrual.status)}
                </StyledTableCell>
                <StyledTableCell>{accrual.confidence !== undefined ? (accrual.confidence * 100).toFixed(0) + '%' : '-'}</StyledTableCell>
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