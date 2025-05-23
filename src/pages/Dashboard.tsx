import React, { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { DailyCloseTask } from '../services/dailyCloseService';
import StatusSelector from '../components/StatusSelector';
import UserAvatar from '../components/UserAvatar';
import PriorityIcon from '../components/PriorityIcon';
import IntegrationLogo from '../components/IntegrationLogo';

import { BankReconciliationTable } from '../components/BankReconciliationTable';
import IndiaTransferView from '../components/TaskContent/IndiaTransferView';
import { AccrualTable } from '../components/AccrualTable';

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  padding: theme.spacing(4),
}));

const CommentInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F8FAFB',
    fontSize: '14px',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '& textarea': {
      padding: '12px 14px',
    },
  },
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  fontSize: '13px',
  color: theme.palette.text.secondary,
  padding: theme.spacing(1.5, 0),
  '&:not(:last-child)': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  },
}));

const TaskHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const TaskTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontFamily: 'Inter Rounded, sans-serif',
}));

const TaskDescription = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  fontFamily: 'Inter Rounded, sans-serif',
}));

/* Commented out for now - will revisit later
const TaskProperties = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  position: 'absolute',
  top: 0,
  right: 0,
}));

const PropertyGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiTypography-root': {
    fontSize: '14px',
    color: theme.palette.text.primary,
  },
}));

const PropertyLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: 'Inter Rounded, sans-serif',
}));
*/

interface DashboardProps {
  selectedTask?: DailyCloseTask | null;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedTask }) => {
  const [comment, setComment] = useState('');

  if (!selectedTask) {
    return (
      <DashboardContainer>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: 'text.secondary',
          fontSize: '15px',
          fontFamily: 'Inter Rounded, sans-serif',
        }}>
          Select a task from the sidebar to view its details
        </Box>
      </DashboardContainer>
    );
  }

  const getIntegrations = (integrations: string): string[] => {
    if (!integrations || integrations === '""' || integrations === '') return [];
    return integrations.split(',').map(i => i.replace(/"/g, '').trim());
  };

  const renderTaskContent = () => {
    if (!selectedTask) return null;

    // Check for specific task types
    switch (selectedTask.step_name) {
      case "Record India i/c cash tranfer":
        return <IndiaTransferView task={selectedTask} />;
      case "Reconcile cash accounts with bank statements":
        return <BankReconciliationTable />;
      case "Record accrued expense":
      case "Record accruals for services":
        return <AccrualTable taskContext={true} />;
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
        sx={{
          '& .MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
          mb: 2,
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '13px',
            '&:hover': {
              color: 'text.primary',
              cursor: 'pointer',
            },
          }}
        >
          {selectedTask.category || 'Tasks'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontSize: '13px',
          }}
        >
          {selectedTask.step_name}
        </Typography>
      </Breadcrumbs>

      {/* Task Details */}
      <Box sx={{ position: 'relative' }}>
        <TaskHeader>
          <TaskTitle>{selectedTask.step_name}</TaskTitle>
          <TaskDescription>{selectedTask.description}</TaskDescription>
        </TaskHeader>
      </Box>

      {/* Task Content */}
      <Box sx={{ flex: 1, mt: 3, overflow: 'auto' }}>
        {renderTaskContent()}
      </Box>

      {/* Comments Section */}
      {/* <Box sx={{ mt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.08)', pt: 2 }}>
        <Typography sx={{ 
          fontSize: '14px', 
          fontWeight: 500, 
          mb: 2,
          fontFamily: 'Inter Rounded, sans-serif',
        }}>
          Comments
        </Typography>
        <CommentInput
          fullWidth
          multiline
          rows={2}
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Box> */}
    </DashboardContainer>
  );
};

export default Dashboard; 