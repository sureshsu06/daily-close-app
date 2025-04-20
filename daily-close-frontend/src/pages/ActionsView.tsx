import React, { useState } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';
import { Anomaly } from '../types';

const ActionsView: React.FC = () => {
  const [filter, setFilter] = useState('all');

  // Mock data - will be replaced with actual data from CSV
  const anomalies: Anomaly[] = [
    {
      id: '1',
      title: 'Revenue Discrepancy',
      description: 'Sales data from platform does not match payment processor data',
      severity: 'high',
      category: 'Revenue',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Inventory Mismatch',
      description: 'Physical count differs from system count by more than 5%',
      severity: 'medium',
      category: 'Inventory',
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Add more mock data as needed
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Error color="error" />;
      case 'medium':
        return <Warning color="warning" />;
      case 'low':
        return <Info color="info" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredAnomalies = filter === 'all' 
    ? anomalies 
    : anomalies.filter(anomaly => anomaly.severity === filter);

  return (
    <Box sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Typography variant="h4" gutterBottom>
        Actions & Anomalies
      </Typography>

      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Filter by Severity</InputLabel>
          <Select
            value={filter}
            label="Filter by Severity"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <List>
        {filteredAnomalies.map((anomaly) => (
          <Paper key={anomaly.id} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemIcon>
                {getSeverityIcon(anomaly.severity)}
              </ListItemIcon>
              <ListItemText
                primary={anomaly.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {anomaly.description}
                    </Typography>
                    <br />
                    <Chip
                      label={anomaly.severity}
                      color={getSeverityColor(anomaly.severity) as any}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={anomaly.status}
                      variant="outlined"
                      size="small"
                    />
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ActionsView; 