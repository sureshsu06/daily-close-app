import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp as AnalysisIcon,
  Schedule as TimingIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { BankTransaction, GLEntry } from '../types';

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '14px',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ActionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
  '& .MuiChip-label': {
    padding: '8px 16px',
  }
}));

interface TransactionAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  transaction: BankTransaction | GLEntry | null;
}

// Mock analysis data based on transaction type and status
const getAnalysis = (transaction: BankTransaction | GLEntry) => {
  // Bank fee transaction in review
  if (transaction.description.includes('fee') && transaction.status === 'review') {
    return {
      contextual: [
        'Monthly service charge from Chase Bank',
        'Fee increased by $2.50 from previous month',
        'New fee structure effective from March 2024',
      ],
      prediction: 'Fee increase aligns with updated service agreement dated Feb 15, 2024',
      recommendation: 'Pass entry to GL account 5020 (Bank Service Charges)',
      followUp: 'Schedule quarterly fee review with Treasury team',
      suggestedActions: [
        { label: 'Pass entry to GL 5020', type: 'match' },
        { label: 'Update fee baseline', type: 'review' },
        { label: 'Add to fee tracker', type: 'flag' },
      ],
    };
  }

  // Wire transfer fee in review
  if (transaction.description.includes('Wire transfer fee') && transaction.status === 'review') {
    return {
      contextual: [
        'International wire transfer fee for payment to Supplier XYZ',
        'Associated with PO#2024-156',
        'Standard fee for EUR transactions',
      ],
      prediction: 'Recurring monthly supplier payment - standard wire fee applies',
      recommendation: 'Pass entry to GL account 5025 (Wire Transfer Charges)',
      followUp: 'Consider adding to automated payment run for next month',
      suggestedActions: [
        { label: 'Pass entry to GL 5025', type: 'match' },
        { label: 'Link to PO#2024-156', type: 'review' },
        { label: 'Add to automation', type: 'flag' },
      ],
    };
  }

  // Customer payment exception
  if (transaction.description.includes('Customer payment') && transaction.status === 'exception') {
    const isPartialPayment = transaction.amount < 5000;
    return {
      contextual: [
        'Payment received via ACH from ACME Corp',
        isPartialPayment 
          ? 'Partial payment against outstanding balance of $12,450'
          : 'Payment exceeds outstanding invoice amount',
        'Customer has multiple open invoices: #892, #897, #901',
      ],
      prediction: isPartialPayment
        ? 'Partial settlement of Invoice #INV-2024-0892'
        : 'Combined payment for multiple invoices',
      recommendation: isPartialPayment
        ? 'Pass entry to invoice #892 and flag remaining balance'
        : 'Split payment across open invoices based on aging',
      followUp: isPartialPayment
        ? 'Follow up on remaining balance next week'
        : 'Request detailed remittance advice from customer',
      suggestedActions: [
        { label: isPartialPayment ? 'Pass entry (partial)' : 'Pass entry (split)', type: 'match' },
        { label: 'Contact ACME Corp', type: 'review' },
        { label: 'Add to collections', type: 'flag' },
      ],
    };
  }

  // Check payment in review
  if (transaction.description.includes('check') && transaction.status === 'review') {
    return {
      contextual: [
        'Check #10789 from Global Services Inc.',
        'Amount includes 2% early payment discount',
        'Payment covers multiple service invoices from Q1',
      ],
      prediction: 'Early payment discount applied correctly per contract terms',
      recommendation: 'Pass entry after splitting across invoices #445, #447, #448',
      followUp: 'Update vendor payment terms in master data',
      suggestedActions: [
        { label: 'Pass entry (multi-invoice)', type: 'match' },
        { label: 'Verify discount', type: 'review' },
        { label: 'Update vendor terms', type: 'flag' },
      ],
    };
  }

  // ACH payment exception
  if (transaction.description.includes('ACH') && transaction.status === 'exception') {
    return {
      contextual: [
        'ACH payment with non-standard reference format',
        'Possible duplicate of transaction from 03/15',
        'Vendor typically pays via check, not ACH',
      ],
      prediction: 'High risk of duplicate payment - requires immediate review',
      recommendation: 'Hold processing until confirming with vendor',
      followUp: 'Update vendor master file with correct payment method',
      suggestedActions: [
        { label: 'Pass entry on hold', type: 'match' },
        { label: 'Check for duplicate', type: 'review' },
        { label: 'Add to exceptions', type: 'flag' },
      ],
    };
  }

  // Default analysis for other cases
  return {
    contextual: [
      'Non-standard transaction format detected',
      'Amount deviates from historical patterns',
      'Transaction date falls outside normal processing window',
    ],
    prediction: 'Manual review required due to unusual characteristics',
    recommendation: 'Route to appropriate department based on transaction type',
    followUp: 'Document resolution for process improvement',
    suggestedActions: [
      { label: 'Pass entry to review', type: 'match' },
      { label: 'Route to department', type: 'review' },
      { label: 'Add to exceptions', type: 'flag' },
    ],
  };
};

export const TransactionAnalysisModal: React.FC<TransactionAnalysisModalProps> = ({
  open,
  onClose,
  transaction,
}) => {
  if (!transaction) return null;

  const analysis = getAnalysis(transaction);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Transaction Analysis
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {transaction.description} - ${transaction.amount.toLocaleString()}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Section>
          <SectionTitle>
            <AnalysisIcon fontSize="small" color="primary" />
            Contextual Analysis
          </SectionTitle>
          <List dense>
            {analysis.contextual.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Section>

        <Divider sx={{ my: 2 }} />

        <Section>
          <SectionTitle>
            <TimingIcon fontSize="small" color="primary" />
            Prediction & Recommendation
          </SectionTitle>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
              <ListItemText primary={analysis.prediction} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
              <ListItemText primary={analysis.recommendation} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
              <ListItemText primary={analysis.followUp} />
            </ListItem>
          </List>
        </Section>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {analysis.suggestedActions.map((action, index) => (
            <ActionChip
              key={index}
              label={action.label}
              className={`action-${action.type}`}
              onClick={() => {
                // Handle action click
                console.log(`Action clicked: ${action.label}`);
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}; 