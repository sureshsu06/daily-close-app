import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Daily Close System
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/pnl')}>
            P&L
          </Button>
          <Button color="inherit" onClick={() => navigate('/actions')}>
            Actions
          </Button>
          <Button color="inherit" onClick={() => navigate('/upload')}>
            Upload
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 