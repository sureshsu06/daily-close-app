import React, { useState } from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { UploadedFile } from '../types';

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

const UploadButton = styled(Button)({}) as typeof Button;

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: 'processing' as const
    }));

    setFiles([...files, ...newFiles]);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <ContentContainer>
      <Typography variant="h4" gutterBottom>
        Upload Financial Data
      </Typography>

      <Paper sx={{ p: 2 }}>
        <input
          accept=".csv,.xlsx,.xls"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="raised-button-file">
          <UploadButton
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
          >
            Upload Files
          </UploadButton>
        </label>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Uploaded Files
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(file.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(2)} KB - ${file.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </ContentContainer>
  );
};

export default FileUpload; 