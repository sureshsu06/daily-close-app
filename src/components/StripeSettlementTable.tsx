import React from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import {
  StyledTableContainer,
  StyledTable,
  StyledTableRow,
  CurrencyCell,
  OrderIdText,
  DateText,
} from './shared/StyledTable';
import DateHeader from './shared/DateHeader';

interface StripePayment {
  Payment_ID: string;
  Order_ID: string;
  Payment_Date: string;
  Amount: number;
  Currency: string;
  Payment_Method: string;
  Stripe_Fee: number;
  Net_Amount: number;
  Status: string;
  Refunded: string;
  Refund_Amount: number;
  Refund_Date: string;
}

const StatusChip = styled(Chip)(({ status }: { status: string }) => ({
  borderRadius: '4px',
  height: '24px',
  backgroundColor: status === 'Yes' ? '#e57373' : '#81c784',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 500,
}));

const DatePickerButton = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

interface StripeSettlementTableProps {
  payments: StripePayment[];
}

export const StripeSettlementTable: React.FC<StripeSettlementTableProps> = ({ payments }) => {
  const [selectedDate, setSelectedDate] = React.useState('2024-03-15');

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.Amount, 0);
  const totalFees = payments.reduce((sum, payment) => sum + payment.Stripe_Fee, 0);
  const totalRefunds = payments.reduce((sum, payment) => sum + payment.Refund_Amount, 0);
  const netAmount = totalAmount - totalFees - totalRefunds;

  const totals = {
    amount: totalAmount,
    fees: totalFees,
    refunds: totalRefunds,
    netAmount: netAmount,
  };

  return (
    <Box>
      <DateHeader 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <StyledTableContainer>
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order Details</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Stripe Fee</TableCell>
              <TableCell align="right">Net Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Refunded</TableCell>
              <TableCell align="right">Refund Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <StyledTableRow key={payment.Payment_ID}>
                <TableCell>
                  <OrderIdText>{payment.Order_ID}</OrderIdText>
                  <DateText>{payment.Payment_Date}</DateText>
                </TableCell>
                <TableCell>{payment.Payment_Method}</TableCell>
                <CurrencyCell>${payment.Amount.toFixed(2)}</CurrencyCell>
                <CurrencyCell>${payment.Stripe_Fee.toFixed(2)}</CurrencyCell>
                <CurrencyCell>${payment.Net_Amount.toFixed(2)}</CurrencyCell>
                <TableCell>
                  <StatusChip 
                    label={payment.Status} 
                    status={payment.Status === 'succeeded' ? 'No' : 'Yes'}
                  />
                </TableCell>
                <TableCell>
                  <StatusChip 
                    label={payment.Refunded} 
                    status={payment.Refunded}
                  />
                </TableCell>
                <CurrencyCell>${payment.Refund_Amount.toFixed(2)}</CurrencyCell>
              </StyledTableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="right">
                <strong>Totals:</strong>
              </TableCell>
              <CurrencyCell>
                <strong>${totals.amount.toFixed(2)}</strong>
              </CurrencyCell>
              <CurrencyCell>
                <strong>${totals.fees.toFixed(2)}</strong>
              </CurrencyCell>
              <CurrencyCell>
                <strong>${totals.netAmount.toFixed(2)}</strong>
              </CurrencyCell>
              <TableCell colSpan={2} />
              <CurrencyCell>
                <strong>${totals.refunds.toFixed(2)}</strong>
              </CurrencyCell>
            </TableRow>
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
};

export default StripeSettlementTable; 