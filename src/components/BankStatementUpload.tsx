import React from 'react';
import { Box, Typography } from '@mui/material';

interface BankStatementUploadProps {
  onUploadComplete: () => void;
}

export const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  onUploadComplete,
}) => {
  // Call onUploadComplete immediately to show the table view
  React.useEffect(() => {
    onUploadComplete();
  }, [onUploadComplete]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Loading Bank Reconciliation Data...
      </Typography>
    </Box>
  );
}; 