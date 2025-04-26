import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  IconButton,
  Alert,
} from '@mui/material';
import { Upload as UploadIcon, Check as CheckIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DailyCloseTask } from '../../services/dailyCloseService';

interface IndiaTransferViewProps {
  task: DailyCloseTask;
}

interface IndianTransaction {
  id: string;
  date: string;
  description: string;
  bankRef: string;
  amount: number;
  selected: boolean;
  jeCreated: boolean;
}

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  whiteSpace: 'nowrap',
  backgroundColor: theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  padding: theme.spacing(1.5),
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
  },
  '&:last-child': {
    borderTopRightRadius: theme.shape.borderRadius,
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

export const IndiaTransferView: React.FC<IndiaTransferViewProps> = ({ task }) => {
  const [fxRate, setFxRate] = useState<number>(0.012);
  const [transactions, setTransactions] = useState<IndianTransaction[]>([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock data - in real app would parse CSV/Excel file
    const mockTransactions: IndianTransaction[] = [
      {
        id: '1',
        date: '2024-03-15',
        description: 'Transfer to US Entity',
        bankRef: 'REF2024031501',
        amount: 500000, // 5 Lakh INR
        selected: false,
        jeCreated: false,
      },
      {
        id: '2',
        date: '2024-03-15',
        description: 'Service Fee Payment',
        bankRef: 'REF2024031502',
        amount: 250000, // 2.5 Lakh INR
        selected: false,
        jeCreated: false,
      },
      {
        id: '3',
        date: '2024-03-15',
        description: 'Technology License Fee',
        bankRef: 'REF2024031503',
        amount: 750000, // 7.5 Lakh INR
        selected: false,
        jeCreated: false,
      },
    ];

    setTransactions(mockTransactions);
    setFileUploaded(true);
  };

  const handleFxRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(event.target.value);
    if (!isNaN(newRate)) {
      setFxRate(newRate);
    }
  };

  const handleTransactionSelect = (id: string) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, selected: !t.selected } : t
    ));
  };

  const createJournalEntries = () => {
    setTransactions(transactions.map(t => 
      t.selected ? { ...t, jeCreated: true, selected: false } : t
    ));
  };

  const getUSDAmount = (inrAmount: number): number => {
    return Number((inrAmount * fxRate).toFixed(2));
  };

  const selectedCount = transactions.filter(t => t.selected).length;
  const totalINR = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalUSD = getUSDAmount(totalINR);

  return (
    <ContentContainer>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center', 
        mb: 2,
        mt: 2 // Changed from -1 to 2 to move controls down
      }}>
        <input
          accept=".csv,.xlsx,.xls"
          style={{ display: 'none' }}
          id="bank-statement-upload"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="bank-statement-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            disabled={fileUploaded}
            size="small"
          >
            Upload Bank Statement
          </Button>
        </label>
        
        <TextField
          label="FX Rate (INR to USD)"
          type="number"
          value={fxRate}
          onChange={handleFxRateChange}
          size="small"
          sx={{ width: 160 }}
          inputProps={{ step: 0.0001 }}
        />
      </Box>

      {fileUploaded && (
        <>
          <Alert severity="info" sx={{ mt: -1, mb: 2 }}>
            Showing {transactions.length} transactions. Total amount: ₹{totalINR.toLocaleString()} (${totalUSD.toLocaleString()})
          </Alert>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell padding="checkbox">
                    <Checkbox disabled />
                  </HeaderCell>
                  <HeaderCell>Date</HeaderCell>
                  <HeaderCell>Description</HeaderCell>
                  <HeaderCell>Bank Ref #</HeaderCell>
                  <HeaderCell align="right">Amount (INR)</HeaderCell>
                  <HeaderCell align="right">Amount (USD)</HeaderCell>
                  <HeaderCell align="center">Status</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    sx={{ 
                      backgroundColor: transaction.jeCreated ? '#f0f7f0' : 'inherit',
                      '&:hover': { backgroundColor: transaction.jeCreated ? '#e6f2e6' : '#f5f5f5' }
                    }}
                  >
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        checked={transaction.selected}
                        onChange={() => handleTransactionSelect(transaction.id)}
                        disabled={transaction.jeCreated}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{transaction.date}</StyledTableCell>
                    <StyledTableCell>{transaction.description}</StyledTableCell>
                    <StyledTableCell>{transaction.bankRef}</StyledTableCell>
                    <StyledTableCell align="right">₹{transaction.amount.toLocaleString()}</StyledTableCell>
                    <StyledTableCell align="right">${getUSDAmount(transaction.amount).toLocaleString()}</StyledTableCell>
                    <StyledTableCell align="center">
                      {transaction.jeCreated ? (
                        <IconButton size="small" color="success">
                          <CheckIcon />
                        </IconButton>
                      ) : (
                        'Pending'
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={createJournalEntries}
              disabled={selectedCount === 0}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Pass JEs
            </Button>
          </Box>
        </>
      )}
    </ContentContainer>
  );
};

export default IndiaTransferView; 