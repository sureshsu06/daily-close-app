import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  styled,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmailIcon from '@mui/icons-material/Email';
import { AccrualEntry } from '../types/accrual';

interface AccrualModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (accrual: Omit<AccrualEntry, 'entryId'>) => void;
  accrual?: AccrualEntry;
  taskContext?: boolean;
}

const HistoryTable = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableCell-root': {
    padding: theme.spacing(1),
  },
}));

// Mock historical data - in real app, this would come from an API
const getHistoricalData = (description: string) => {
  return [
    { date: '2024-02-15', amount: 4800, status: 'complete', attachmentType: 'file' },
    { date: '2024-01-15', amount: 4600, status: 'complete', attachmentType: 'email' },
    { date: '2023-12-15', amount: 5100, status: 'complete', attachmentType: null },
  ];
};

export const AccrualModal: React.FC<AccrualModalProps> = ({
  open,
  onClose,
  onSave,
  accrual,
  taskContext = false,
}) => {
  const [formData, setFormData] = React.useState<Partial<AccrualEntry>>({
    date: new Date().toISOString().split('T')[0],
    type: taskContext ? 'Monthly expense' : 'Recurring',
    status: 'pending',
    category: taskContext ? 'Expense' : '',
    ...accrual,
  });

  const handleTextChange = (field: keyof AccrualEntry) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      formData.date &&
      formData.description &&
      formData.amount &&
      formData.vendor &&
      formData.reference
    ) {
      onSave(formData as Omit<AccrualEntry, 'entryId'>);
      onClose();
    }
  };

  // Get historical data
  const history = formData.description ? getHistoricalData(formData.description) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {accrual ? 'Edit Expense Accrual' : 'New Expense Accrual'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Date and Amount row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Date *"
                  type="date"
                  value={formData.date || ''}
                  onChange={handleTextChange('date')}
                  InputLabelProps={{ shrink: true }}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton edge="end">
                        <CalendarIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Amount *"
                  type="number"
                  value={formData.amount || ''}
                  onChange={handleTextChange('amount')}
                  required
                />
              </Box>
            </Box>

            {/* Description */}
            <TextField
              fullWidth
              label="Description *"
              value={formData.description || ''}
              onChange={handleTextChange('description')}
              required
            />

            {/* Vendor and Reference row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Vendor *"
                  value={formData.vendor || ''}
                  onChange={handleTextChange('vendor')}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Reference *"
                  value={formData.reference || ''}
                  onChange={handleTextChange('reference')}
                  required
                />
              </Box>
            </Box>

            {/* Notes */}
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={formData.notes || ''}
              onChange={handleTextChange('notes')}
            />

            {/* Historical Data */}
            {accrual && history.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Past 3 Months History
                </Typography>
                <HistoryTable>
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
                          <TableCell align="right">${record.amount.toLocaleString()}</TableCell>
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
                </HistoryTable>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#4285F4' }}>
            CANCEL
          </Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#4285F4' }}>
            SAVE
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 