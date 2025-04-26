import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUpload } from '@mui/icons-material';

const UploadContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[100],
  },
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const StyledUploadIcon = styled(CloudUpload)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.grey[400],
  marginBottom: theme.spacing(2),
}));

interface BankStatementUploadProps {
  onUploadComplete: () => void;
}

export const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  onUploadComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv') {
      alert('Please upload a CSV file');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would:
      // 1. Read the CSV file
      // 2. Parse the data
      // 3. Send it to your backend
      // 4. Update the bank transactions state
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Upload Bank Statement
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Upload your bank statement CSV file to start the reconciliation process
      </Typography>
      
      <UploadContainer
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          borderColor: isDragging ? 'primary.main' : 'grey.300',
        }}
      >
        <StyledUploadIcon />
        <Typography variant="h6" gutterBottom>
          Drag and drop your CSV file here
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or
        </Typography>
        <label htmlFor="bank-statement-upload">
          <HiddenInput
            id="bank-statement-upload"
            type="file"
            accept=".csv"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFileSelect(files[0]);
              }
            }}
          />
          <Button
            variant="outlined"
            component="span"
            disabled={isUploading}
          >
            Browse Files
          </Button>
        </label>
        
        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Selected file: {selectedFile.name}
            </Typography>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={isUploading}
              sx={{ mt: 2 }}
            >
              {isUploading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Uploading...
                </>
              ) : (
                'Upload Statement'
              )}
            </Button>
          </Box>
        )}
      </UploadContainer>
      
      <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: 'block' }}>
        Supported format: CSV
      </Typography>
    </Box>
  );
}; 