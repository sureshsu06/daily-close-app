import React, { useState } from 'react';
import { Box, Popover, List, ListItemButton, ListItemIcon } from '@mui/material';
import StatusIcon from './StatusIcon';

interface StatusSelectorProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center' | 'right';
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ 
  currentStatus, 
  onStatusChange, 
  size = 'medium',
  align = 'center'
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (status: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    onStatusChange(status);
    handleClose();
  };

  const statuses = ['Backlog', 'In Progress', 'Completed'];

  return (
    <>
      <Box 
        onClick={handleClick}
        sx={{ 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          '&:hover': {
            opacity: 0.8
          }
        }}
      >
        <StatusIcon status={currentStatus} size={size} />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              marginTop: 0.5,
            }
          }
        }}
      >
        <List sx={{ p: 1, minWidth: 120 }}>
          {statuses.map((status) => (
            <ListItemButton
              key={status}
              onClick={handleStatusSelect(status)}
              dense
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:last-child': { mb: 0 },
                justifyContent: 'flex-start',
                py: 0.5,
                px: 2
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <StatusIcon status={status} size={size} />
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default StatusSelector; 