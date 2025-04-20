import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DailyCloseTask, SubStep } from '../services/dailyCloseService';
import StatusIcon from './StatusIcon';
import StatusSelector from './StatusSelector';

interface TaskQuickViewProps {
  open: boolean;
  onClose: () => void;
  task: DailyCloseTask | SubStep | null;
  isSubtask?: boolean;
  onStatusChange?: (taskId: number, newStatus: string, isSubtask?: boolean, subtaskId?: number) => void;
}

const TaskQuickView: React.FC<TaskQuickViewProps> = ({ open, onClose, task, isSubtask = false, onStatusChange }) => {
  if (!task) return null;

  const isParentTask = 'substeps' in task;

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      if (isSubtask) {
        const subtask = task as SubStep;
        onStatusChange(parseInt(subtask.main_step), newStatus, true, subtask.sub_step_number);
      } else {
        const mainTask = task as DailyCloseTask;
        onStatusChange(mainTask.step_number, newStatus);
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          height: '100%',
          maxWidth: '1200px',
          padding: 3,
          fontFamily: 'Inter Rounded, sans-serif',
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '1200px',
          }
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          pb: 2
        }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {isSubtask ? (task as SubStep).sub_step_name : (task as DailyCloseTask).step_name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          pr: 2,
          mr: -2
        }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              {isSubtask ? (task as SubStep).sub_step_description : (task as DailyCloseTask).description}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Details</Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Box sx={{ '& > div': { justifyContent: 'flex-start' } }}>
                        <StatusSelector
                          currentStatus={task.status}
                          onStatusChange={handleStatusChange}
                          size={isSubtask ? 'small' : 'medium'}
                          align="left"
                        />
                      </Box>
                    </Box>
                  }
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Assignee"
                  secondary={task.assigned_to}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              {!isSubtask && (
                <ListItem>
                  <ListItemText
                    primary="Priority"
                    secondary={(task as DailyCloseTask).priority}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              )}
              <ListItem>
                <ListItemText
                  primary="Estimated Time"
                  secondary={`${task.estimated_time_minutes} minutes`}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Requirements */}
          {!isSubtask && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Requirements</Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Approval Required"
                    secondary={(task as DailyCloseTask).requires_approval ? 'Yes' : 'No'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Integration Required"
                    secondary={(task as DailyCloseTask).integration_required ? 'Yes' : 'No'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </Box>
          )}

          {/* Subtasks (only for parent tasks) */}
          {isParentTask && (task as DailyCloseTask).substeps && (task as DailyCloseTask).substeps.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Subtasks</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Assignee</TableCell>
                      <TableCell>Est. Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(task as DailyCloseTask).substeps.map((subtask) => (
                      <TableRow 
                        key={subtask.sub_step_number}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          onClose();
                          // Add logic to open subtask quick view
                        }}
                      >
                        <TableCell sx={{ '& > div': { justifyContent: 'flex-start' } }}>
                          <StatusSelector
                            currentStatus={subtask.status}
                            onStatusChange={(newStatus) => {
                              if (onStatusChange) {
                                onStatusChange((task as DailyCloseTask).step_number, newStatus, true, subtask.sub_step_number);
                              }
                            }}
                            size="small"
                            align="left"
                          />
                        </TableCell>
                        <TableCell>{subtask.sub_step_name}</TableCell>
                        <TableCell>{subtask.assigned_to}</TableCell>
                        <TableCell>{subtask.estimated_time_minutes} min</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Task Output */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Task Output</Typography>
            <Box sx={{ 
              backgroundColor: '#F8FAFB',
              borderRadius: 1,
              p: 2,
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography color="text.secondary">
                No output data available yet
              </Typography>
            </Box>
          </Box>

          {/* Exhibits */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Exhibits</Typography>
            <Box sx={{ 
              backgroundColor: '#F8FAFB',
              borderRadius: 1,
              p: 2,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography color="text.secondary">
                No exhibits attached
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Mark as Complete
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Add Note
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TaskQuickView; 