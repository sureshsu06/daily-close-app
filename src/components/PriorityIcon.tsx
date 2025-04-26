import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const SignalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '2px',
  padding: '0 1px'
}));

const SignalBar = styled(Box)(({ theme }) => ({
  borderRadius: '1px',
}));

interface PriorityIconProps {
  priority: number | string;
  size?: 'small' | 'medium';
}

const getPriorityColor = (priority: number | string): string => {
  const numPriority = typeof priority === 'string' ? parseInt(priority, 10) : priority;
  switch (numPriority) {
    case 1:
      return '#F44336'; // Urgent - Red
    case 2:
      return '#FF9800'; // High - Orange
    case 3:
      return '#4CAF50'; // Medium - Green
    case 4:
      return '#9E9E9E'; // Low - Gray
    default:
      return '#E0E0E0'; // No priority - Light Gray
  }
};

const getPriorityLabel = (priority: number | string): string => {
  const numPriority = typeof priority === 'string' ? parseInt(priority, 10) : priority;
  switch (numPriority) {
    case 1:
      return 'Urgent';
    case 2:
      return 'High';
    case 3:
      return 'Medium';
    case 4:
      return 'Low';
    default:
      return 'No priority';
  }
};

const PriorityIcon: React.FC<PriorityIconProps> = ({ priority, size = 'medium' }) => {
  const numPriority = typeof priority === 'string' ? parseInt(priority, 10) : priority;
  const color = getPriorityColor(priority);
  const isSmall = size === 'small';
  
  // Dimensions for main tasks and subtasks
  const dimensions = isSmall ? {
    containerHeight: 12,
    barWidth: 2,
    baseHeight: 8,
    heightStep: 3,
    exclamationSize: 14,
    boxSize: 16
  } : {
    containerHeight: 16,
    barWidth: 3,
    baseHeight: 14,
    heightStep: 4,
    exclamationSize: 16,
    boxSize: 20
  };
  
  if (numPriority === 1) {
    return (
      <Tooltip title="Urgent">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#F44336',
          fontSize: dimensions.exclamationSize,
          fontWeight: 'bold',
          width: dimensions.boxSize,
          height: dimensions.boxSize
        }}>
          !
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={getPriorityLabel(priority)}>
      <SignalContainer sx={{ height: dimensions.containerHeight }}>
        <SignalBar sx={{ 
          width: dimensions.barWidth,
          height: dimensions.baseHeight - (dimensions.heightStep * 2),
          backgroundColor: numPriority <= 4 ? color : '#E0E0E0'
        }} />
        <SignalBar sx={{ 
          width: dimensions.barWidth,
          height: dimensions.baseHeight - dimensions.heightStep,
          backgroundColor: numPriority <= 3 ? color : '#E0E0E0'
        }} />
        <SignalBar sx={{ 
          width: dimensions.barWidth,
          height: dimensions.baseHeight,
          backgroundColor: numPriority <= 2 ? color : '#E0E0E0'
        }} />
      </SignalContainer>
    </Tooltip>
  );
};

export default PriorityIcon; 