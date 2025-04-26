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

interface IndianTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  amountUSD: number | null;
  selected: boolean;
  jeCreated: boolean;
}

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  whiteSpace: 'nowrap',
  backgroundColor: theme.palette.grey[50],
}));

export const IndiaTransferView: React.FC = () => {
  const [fxRate, setFxRate] = useState<number>(0.012); // Example rate: 1 INR = 0.012 USD
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
        amount: 500000, // 5 Lakh INR
        amountUSD: null,
        selected: false,
        jeCreated: false,
      },
      {
        id: '2',
        date: '2024-03-15',
        description: 'Service Fee Payment',
        amount: 250000, // 2.5 Lakh INR
        amountUSD: null,
        selected: false,
        jeCreated: false,
      },
      {
        id: '3',
        date: '2024-03-15',
        description: 'Technology License Fee',
        amount: 750000, // 7.5 Lakh INR
        amountUSD: null,
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

  const getUSDAmount = (inrAmount: number) => {
    return (inrAmount * fxRate).toFixed(2);
  };

  const selectedCount = transactions.filter(t => t.selected).length;
  const totalINR = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalUSD = (totalINR * fxRate).toFixed(2);

  return (
    <ContentContainer>
      <Typography variant="h5" gutterBottom>
        Record India i/c cash transfer
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
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
            >
              Upload Bank Statement
            </Button>
          </label>
          
          <TextField
            label="FX Rate (INR to USD)"
            type="number"
            value={fxRate}
            onChange={handleFxRateChange}
            sx={{ width: 200 }}
            inputProps={{ step: 0.0001 }}
          />
        </Box>

        {fileUploaded && (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Showing {transactions.length} transactions. Total amount: ₹{totalINR.toLocaleString()} (${totalUSD})
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
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={transaction.selected}
                          onChange={() => handleTransactionSelect(transaction.id)}
                          disabled={transaction.jeCreated}
                        />
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell align="right">₹{transaction.amount.toLocaleString()}</TableCell>
                      <TableCell align="right">${getUSDAmount(transaction.amount)}</TableCell>
                      <TableCell align="center">
                        {transaction.jeCreated ? (
                          <IconButton size="small" color="success">
                            <CheckIcon />
                          </IconButton>
                        ) : (
                          'Pending'
                        )}
                      </TableCell>
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
              >
                Create Journal Entries ({selectedCount} selected)
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </ContentContainer>
  );
};

export default IndiaTransferView; 