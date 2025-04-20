import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PnLData } from '../types';

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

const PnLView: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('day');

  // Mock data - will be replaced with actual data from CSV
  const pnlData: PnLData[] = [
    {
      date: '2024-04-20',
      revenue: 150000,
      cogs: 75000,
      operatingExpenses: 45000,
      netIncome: 30000,
      details: {
        'Product Sales': 120000,
        'Service Revenue': 30000,
        'Shipping Costs': 15000,
        'Marketing': 20000,
        'Salaries': 10000
      }
    },
    // Add more mock data as needed
  ];

  const handleTimePeriodChange = (event: any) => {
    setTimePeriod(event.target.value);
  };

  return (
    <ContentContainer>
      <Typography variant="h4" gutterBottom>
        Profit & Loss Statement
      </Typography>

      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            label="Time Period"
            onChange={handleTimePeriodChange}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">COGS</TableCell>
              <TableCell align="right">Operating Expenses</TableCell>
              <TableCell align="right">Net Income</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pnlData.map((row) => (
              <TableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                <TableCell align="right">${row.cogs.toLocaleString()}</TableCell>
                <TableCell align="right">${row.operatingExpenses.toLocaleString()}</TableCell>
                <TableCell align="right">${row.netIncome.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detailed Breakdown */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Detailed Breakdown
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pnlData[0]?.details && Object.entries(pnlData[0].details).map(([category, amount]) => (
                <TableRow key={category}>
                  <TableCell>{category}</TableCell>
                  <TableCell align="right">${amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </ContentContainer>
  );
};

export default PnLView; 