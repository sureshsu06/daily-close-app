import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import { EmailModal } from './EmailModal';

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
    fontSize: '13px',
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontSize: '13px',
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SectionContent = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
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
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailType, setEmailType] = useState<'bank' | 'collections'>('bank');

  const handleEmailAction = (type: 'bank' | 'collections') => {
    setEmailType(type);
    setEmailModalOpen(true);
  };

  const handleReverseEntry = () => {
    // Handle reverse entry action
    console.log('Reverse entry clicked');
  };

  if (!transaction) return null;

  // Custom logic for NON-CHASE FEE-WITH
  const isNonChaseFeeWith = transaction.description.includes('NON-CHASE FEE-WITH');
  const nonChaseContextual = [
    'Non-standard transaction detected - attributable to bank fees',
    "Similar transaction name has previously been seen in Jan'24, Sep'23, Mar'23.",
    'Previously we passed a GL entry for these transactions',
  ];
  const nonChasePrediction = [
    'Manual review required due to it being an exception',
    'Email bank support for more details on this particular fee',
    'Document for the future',
  ];
  const nonChaseHistory = [
    { date: "2024-01-31", name: 'NON-CHASE FEE-WITH', amount: 350, notes: 'GL entry passed' },
    { date: "2023-09-30", name: 'NON-CHASE FEE-WITH', amount: 340, notes: 'GL entry passed' },
    { date: "2023-03-31", name: 'NON-CHASE FEE-WITH', amount: 355, notes: 'GL entry passed' },
  ];

  const analysis = getAnalysis(transaction);

  return (
    <>
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
          {/* Only show action chips at the top if not NON-CHASE FEE-WITH */}
          {!isNonChaseFeeWith && (
            <Box sx={{ mb: 3, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <ActionChip
                label="Email Bank Support"
                onClick={() => handleEmailAction('bank')}
                clickable
              />
              <ActionChip
                label="Email Collections Team"
                onClick={() => handleEmailAction('collections')}
                clickable
              />
              <ActionChip
                label="Reverse Entry"
                onClick={handleReverseEntry}
                clickable
              />
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Section>
            <SectionTitle>
              <AnalysisIcon fontSize="small" color="primary" />
              Contextual Analysis
            </SectionTitle>
            <List dense>
              {(isNonChaseFeeWith ? nonChaseContextual : analysis.contextual).map((item, index) => (
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
              {(isNonChaseFeeWith ? nonChasePrediction : [analysis.prediction, analysis.recommendation, analysis.followUp]).map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Section>

          {/* Historical Table for NON-CHASE FEE-WITH */}
          {isNonChaseFeeWith && (
            <Section>
              <SectionTitle>Previous Occurrences</SectionTitle>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Transaction Name</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #ddd' }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonChaseHistory.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{row.date}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{row.name}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #eee', textAlign: 'right' }}>${row.amount}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Section>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* For NON-CHASE FEE-WITH, show chips at the bottom above Close */}
          {isNonChaseFeeWith && (
            <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <ActionChip
                label="Email Bank Support"
                onClick={() => handleEmailAction('bank')}
                clickable
              />
              <ActionChip
                label="Pass GL Entry"
                onClick={handleReverseEntry}
                clickable
              />
              <ActionChip
                label="Create Task"
                onClick={() => {}}
                clickable
              />
            </Box>
          )}
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <EmailModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        transaction={transaction}
        emailType={emailType}
      />
    </>
  );
}; 