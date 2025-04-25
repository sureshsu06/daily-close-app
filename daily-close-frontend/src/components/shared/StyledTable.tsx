import { styled } from '@mui/material/styles';
import {
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  '& .MuiTableCell-root': {
    fontFamily: 'Inter Rounded, sans-serif',
    fontSize: '13px',
    color: theme.palette.text.primary,
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    fontFamily: 'Inter Rounded, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    padding: '12px 16px',
  }
}));

export const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
  }
});

export const StyledTableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  }
});

export const CurrencyCell = styled(TableCell)({
  fontFamily: 'Inter Rounded, sans-serif',
  textAlign: 'right',
  fontFeatureSettings: '"tnum" on, "lnum" on',
});

export const OrderIdText = styled('div')({
  fontFamily: 'Inter Rounded, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  color: '#1a73e8',
  marginBottom: '4px',
});

export const DateText = styled('div')(({ theme }) => ({
  fontFamily: 'Inter Rounded, sans-serif',
  fontSize: '12px',
  color: theme.palette.text.secondary,
})); 