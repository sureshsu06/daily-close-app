import React from 'react';
import {
  RadioButtonUnchecked as BacklogIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const InProgressIcon: React.FC<{ size: { width: number; height: number } }> = ({ size }) => (
  <svg
    width={size.width}
    height={size.height}
    viewBox="0 0 24 24"
    style={{ display: 'block' }}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="#FFC107"
      strokeWidth="2"
    />
    <path
      d="M12 3 A 9 9 0 0 0 12 21"
      fill="#FFC107"
    />
  </svg>
);

interface StatusIconProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, size = 'medium' }) => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return { width: 20, height: 20 };
      case 'large':
        return { width: 28, height: 28 };
      default:
        return { width: 24, height: 24 };
    }
  };

  const iconSize = getIconSize();

  const iconProps = {
    sx: { 
      width: iconSize.width,
      height: iconSize.height,
    }
  };

  const getIcon = () => {
    switch (normalizedStatus) {
      case 'inprogress':
        return <InProgressIcon size={iconSize} />;
      case 'completed':
        return <CompletedIcon {...iconProps} sx={{ ...iconProps.sx, color: '#1976D2' }} />;
      default:
        return <BacklogIcon {...iconProps} sx={{ ...iconProps.sx, color: '#757575' }} />;
    }
  };

  return (
    <Tooltip title={status}>
      <Box component="span" sx={{ 
        display: 'inline-flex', 
        alignItems: 'center',
        justifyContent: 'center',
        width: iconSize.width,
        height: iconSize.height
      }}>
        {getIcon()}
      </Box>
    </Tooltip>
  );
};

export default StatusIcon; 