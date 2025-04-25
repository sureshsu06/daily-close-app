import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Avatar,
  Divider,
  Breadcrumbs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Link as LinkIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DailyCloseTask, SubStep } from '../services/dailyCloseService';
import StatusSelector from './StatusSelector';
import UserAvatar from './UserAvatar';
import PriorityIcon from './PriorityIcon';
import IntegrationLogo from './IntegrationLogo';
import { ShopifyOrdersTable } from './ShopifyOrdersTable';
import { getMockShopifyOrders } from '../services/shopifyService';
import StripeSettlementTable from './StripeSettlementTable';
import { getMockStripePayments } from '../services/stripeService';
import { BankReconciliationTable } from './BankReconciliationTable';

interface TaskQuickViewProps {
  open: boolean;
  onClose: () => void;
  task: DailyCloseTask | SubStep | null;
  isSubtask?: boolean;
  onStatusChange?: (taskId: number, newStatus: string, isSubtask?: boolean, subtaskId?: number) => void;
}

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

const HeaderButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const TaskQuickView: React.FC<TaskQuickViewProps> = ({ open, onClose, task, isSubtask = false, onStatusChange }) => {
  const [comment, setComment] = useState('');
  
  if (!task) return null;

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '1200px',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex',
        height: '100%',
      }}>
        {/* Main Content */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          pl: 4,
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}>
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
                {(task as DailyCloseTask).category || 'Tasks'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isSubtask ? 'text.secondary' : 'text.primary',
                  fontSize: '13px',
                  '&:hover': {
                    cursor: isSubtask ? 'pointer' : 'default',
                    color: isSubtask ? 'text.primary' : 'text.primary',
                  },
                }}
              >
                {isSubtask ? (task as SubStep).main_step_name : (task as DailyCloseTask).step_name}
              </Typography>
              {isSubtask && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.primary',
                    fontSize: '13px',
                  }}
                >
                  {(task as SubStep).sub_step_name}
                </Typography>
              )}
            </Breadcrumbs>
          </Box>

          {/* Description and Title */}
          <Box sx={{ px: 2, pb: 0.5 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              {isSubtask ? (task as SubStep).sub_step_name : (task as DailyCloseTask).step_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSubtask ? (task as SubStep).sub_step_description : (task as DailyCloseTask).description}
            </Typography>
          </Box>

          {/* Main Data Table */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            mb: 3
          }}>
            {!isSubtask && (task as DailyCloseTask).step_name === 'Reconcile cash accounts with bank statements' ? (
              <BankReconciliationTable 
                onExceptionFound={(transaction) => {
                  console.log('Exception found:', transaction);
                }}
              />
            ) : !isSubtask && (task as DailyCloseTask).step_name === 'Extract Stripe daily settlement report with fees and refunds' ? (
              <StripeSettlementTable payments={getMockStripePayments()} />
            ) : (
              <ShopifyOrdersTable orders={getMockShopifyOrders()} />
            )}
          </Box>

          {/* Activity List */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                mb: 2
              }}
            >
              Activity
            </Typography>
            <ActivityItem>
              <UserAvatar name="Pip" size="small" />
              <Box>
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Pip
                </Box>
                {' '}created this task
                <Box component="span" sx={{ display: 'block', fontSize: '12px', mt: 0.5 }}>
                  1 day ago
                </Box>
              </Box>
            </ActivityItem>

            <ActivityItem>
              <UserAvatar name="Marie" size="small" />
              <Box>
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Marie Landau
                </Box>
                {' '}changed status to In Progress
                <Box component="span" sx={{ display: 'block', fontSize: '12px', mt: 0.5 }}>
                  2 hours ago
                </Box>
              </Box>
            </ActivityItem>
          </Box>

          {/* Comment Section */}
          <Box 
            component="form" 
            onSubmit={handleCommentSubmit} 
            sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}
          >
            <Box sx={{ 
              position: 'relative',
              backgroundColor: '#F8FAFB',
              borderRadius: 1,
            }}>
              <CommentInput
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Box sx={{ 
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <LinkIcon fontSize="small" />
                </IconButton>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<SendIcon />}
                  disabled={!comment.trim()}
                  type="submit"
                  sx={{ 
                    textTransform: 'none',
                    minWidth: '80px',
                    px: 2,
                    height: 28,
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Properties Sidebar */}
        <Box sx={{ 
          width: '240px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              mb: 1,
            }}
          >
            Properties
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StatusSelector
                currentStatus={task.status}
                onStatusChange={handleStatusChange}
                size="medium"
                align="left"
              />
            </Box>

            {/* Prepared By */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mb: 0.5 }}>
                Prepared By
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar name={task.assigned_to === 'Pip' ? 'Pip' : task.prepared_by || 'Not Set'} />
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {task.assigned_to === 'Pip' ? 'Pip' : task.prepared_by || 'Not Set'}
                </Typography>
              </Box>
            </Box>

            {/* Reviewed By */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mb: 0.5 }}>
                Reviewed By
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar name={task.reviewed_by || 'Not Set'} />
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {task.reviewed_by || 'Not Set'}
                </Typography>
              </Box>
            </Box>

            {/* Integrations */}
            {!isSubtask && (task as DailyCloseTask).integration_required && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {(task as DailyCloseTask).required_integrations.split(',').map(integration => (
                    <Box key={integration} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <IntegrationLogo integration={integration.trim()} size="small" />
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {integration.trim()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Priority */}
            {!isSubtask && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PriorityIcon priority={(task as DailyCloseTask).priority} />
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {(task as DailyCloseTask).priority}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TaskQuickView; 