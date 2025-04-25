import React from 'react';
import {
  Box,
  IconButton,
  TextField,
  useTheme,
} from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';

interface DateHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateHeader: React.FC<DateHeaderProps> = ({ selectedDate, onDateChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3
    }}>
      <TextField
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '36px',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            '& fieldset': {
              borderColor: 'transparent'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.12)'
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main
            }
          },
          '& input': {
            fontSize: '13px',
            fontFamily: 'Inter Rounded, sans-serif',
            color: theme.palette.text.primary,
            padding: '8px 12px'
          }
        }}
      />
      <IconButton 
        sx={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
          },
          color: '#217346'
        }}
      >
        <TableViewIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default DateHeader; 