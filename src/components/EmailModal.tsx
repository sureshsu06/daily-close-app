import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BankTransaction, GLEntry } from '../types';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-input': {
    fontSize: '14px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
  },
}));

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  transaction: BankTransaction | GLEntry | null;
  emailType: 'bank' | 'collections';
}

export const EmailModal: React.FC<EmailModalProps> = ({
  open,
  onClose,
  transaction,
  emailType,
}) => {
  const getEmailTemplate = () => {
    if (!transaction) return { to: '', subject: '', body: '' };

    const date = new Date(transaction.date).toLocaleDateString();
    const amount = transaction.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (emailType === 'bank') {
      return {
        to: 'bank.support@example.com',
        subject: `Transaction Inquiry - ${date} - ${amount}`,
        body: `Dear Bank Support Team,

I am writing to inquire about a transaction in our account that requires clarification:

Transaction Details:
- Date: ${date}
- Amount: ${amount}
- Description: ${transaction.description}
${('checkNumber' in transaction) ? `- Reference/Check Number: ${transaction.checkNumber}` : ''}

We are unable to reconcile this transaction with our internal records and would appreciate your assistance in providing:
1. Additional transaction details
2. Any related reference numbers
3. The originating party information if available

Please review and provide any information that could help us properly reconcile this transaction.

Thank you for your assistance.

Best regards,
[Your Name]
[Company Name]`,
      };
    } else {
      return {
        to: 'collections@company.com',
        subject: `Collection Review Required - ${date} - ${amount}`,
        body: `Hi Collections Team,

We have identified a transaction that requires your review and follow-up:

Transaction Details:
- Date: ${date}
- Amount: ${amount}
- Description: ${transaction.description}
${('checkNumber' in transaction) ? `- Reference/Check Number: ${transaction.checkNumber}` : ''}

This transaction has been flagged during our reconciliation process and needs investigation. Please:
1. Review the transaction details
2. Contact the relevant parties if necessary
3. Update the reconciliation status once resolved

Please update the team once you have more information about this transaction.

Thanks,
[Your Name]`,
      };
    }
  };

  const template = getEmailTemplate();

  const handleSend = () => {
    // In a real application, this would send the email
    // For now, we'll just close the modal
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {emailType === 'bank' ? 'Email Bank Support' : 'Email Collections Team'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <StyledTextField
            label="To"
            fullWidth
            defaultValue={template.to}
            InputProps={{ readOnly: true }}
          />
          <StyledTextField
            label="Subject"
            fullWidth
            defaultValue={template.subject}
          />
          <StyledTextField
            label="Message"
            fullWidth
            multiline
            rows={15}
            defaultValue={template.body}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSend} variant="contained" color="primary">
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 