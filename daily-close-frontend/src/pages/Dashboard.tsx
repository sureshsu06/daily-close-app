import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper,
  CircularProgress,
  Collapse,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown, KeyboardArrowUp, Add, KeyboardArrowRight, FilterList } from '@mui/icons-material';
import { fetchDailyCloseTasks, CategoryTasks, DailyCloseTask, SubStep } from '../services/dailyCloseService';
import TaskQuickView from '../components/TaskQuickView';
import StatusSelector from '../components/StatusSelector';
import UserAvatar from '../components/UserAvatar';
import PriorityIcon from '../components/PriorityIcon';

const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  fontFamily: 'Inter, sans-serif',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const TopNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: '12px 16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}));

const NavTab = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: '6px 12px',
  minWidth: 'auto',
  fontWeight: 500,
  fontSize: '14px',
  color: '#111111',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&.active': {
    backgroundColor: '#F3F3F7',
    color: '#111111',
  },
  borderRadius: '6px',
}));

const MainContent = styled(Box)({
  padding: '16px',
  flex: 1,
  overflow: 'auto',
});

const CategoryHeader = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  color: theme.palette.text.primary,
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  borderRadius: '6px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  '& .category-count': {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontWeight: 'normal',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter Rounded, sans-serif',
  padding: theme.spacing(1.5),
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  '&.priority-column': {
    width: '32px',
    padding: theme.spacing(1),
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }
  },
  '&.status-column': {
    width: '32px',
    padding: theme.spacing(1),
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }
  },
  '&.expand-column': {
    width: '20px',
    padding: 0,
    '& .MuiIconButton-root': {
      padding: 0,
      '& svg': {
        fontSize: '1.1rem'
      }
    }
  },
  '&.name-column': {
    width: 'auto',
    paddingLeft: theme.spacing(0.5),
  },
  '&.assignee-column': {
    width: '40px',
    padding: theme.spacing(1),
    '& > div': {
      display: 'flex',
      justifyContent: 'center'
    }
  },
  '&.subtask': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    backgroundColor: '#F8FAFB',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    cursor: 'pointer',
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  padding: '6px 12px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    marginRight: theme.spacing(0.5),
  },
}));

interface RowProps {
  task: DailyCloseTask;
  onTaskClick: (task: DailyCloseTask) => void;
  onSubtaskClick: (subtask: SubStep) => void;
  onStatusChange: (taskId: number, newStatus: string, isSubtask?: boolean, subtaskId?: number) => void;
}

const TaskRow: React.FC<RowProps> = ({ task, onTaskClick, onSubtaskClick, onStatusChange }) => {
  const [open, setOpen] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleSubtaskClick = (e: React.MouseEvent, subtask: SubStep) => {
    e.stopPropagation();
    onSubtaskClick(subtask);
  };

  return (
    <>
      <StyledTableRow onClick={() => onTaskClick(task)}>
        <StyledTableCell className="priority-column">
          <Box>
            <PriorityIcon priority={task.priority} />
          </Box>
        </StyledTableCell>
        <StyledTableCell 
          className="status-column" 
          sx={{ 
            width: '32px', 
            padding: '8px',
            '& > div': {
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }
          }}
        >
          <StatusSelector 
            currentStatus={task.status}
            onStatusChange={(newStatus) => onStatusChange(task.step_number, newStatus)}
            align="center"
          />
        </StyledTableCell>
        <StyledTableCell className="expand-column" padding="none">
          <IconButton size="small" onClick={handleExpandClick}>
            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell className="name-column">{task.step_name}</StyledTableCell>
        <StyledTableCell className="assignee-column">
          <Box>
            <UserAvatar name={task.assigned_to} />
          </Box>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table>
              <TableBody>
                {task.substeps?.map((substep) => (
                  <TableRow 
                    key={substep.sub_step_number}
                    onClick={(e) => handleSubtaskClick(e, substep)}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        cursor: 'pointer',
                      },
                      backgroundColor: '#F8FAFB',
                    }}
                  >
                    <StyledTableCell className="priority-column">
                      <Box>
                        <PriorityIcon priority={task.priority} size="small" />
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell 
                      className="status-column" 
                      sx={{ 
                        width: '32px', 
                        padding: '8px',
                        '& > div': {
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%'
                        }
                      }}
                    >
                      <StatusSelector 
                        currentStatus={substep.status}
                        onStatusChange={(newStatus) => onStatusChange(task.step_number, newStatus, true, substep.sub_step_number)}
                        size="small"
                        align="center"
                      />
                    </StyledTableCell>
                    <StyledTableCell className="expand-column" padding="none" />
                    <StyledTableCell className="name-column" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{substep.sub_step_name}</StyledTableCell>
                    <StyledTableCell className="assignee-column">
                      <Box>
                        <UserAvatar name={substep.assigned_to} size="small" />
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CategorySection: React.FC<{
  category: CategoryTasks;
  onTaskClick: (task: DailyCloseTask) => void;
  onSubtaskClick: (subtask: SubStep) => void;
  onStatusChange: (taskId: number, newStatus: string, isSubtask?: boolean, subtaskId?: number) => void;
}> = ({ category, onTaskClick, onSubtaskClick, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Box sx={{ mb: 2 }}>
      <CategoryHeader
        onClick={() => setIsExpanded(!isExpanded)}
        startIcon={
          <IconButton size="small" sx={{ p: 0 }}>
            {isExpanded ? (
              <KeyboardArrowDown sx={{ fontSize: '1.2rem' }} />
            ) : (
              <KeyboardArrowRight sx={{ fontSize: '1.2rem' }} />
            )}
          </IconButton>
        }
      >
        {category.category}
        <span className="category-count">{category.tasks.length}</span>
      </CategoryHeader>
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1 }}>
          <TableContainer component={Paper} sx={{ 
            boxShadow: 'none', 
            backgroundColor: 'transparent',
            '& .MuiTable-root': {
              backgroundColor: 'transparent'
            }
          }}>
            <Table>
              <TableBody>
                {category.tasks.map((task) => (
                  <TaskRow 
                    key={task.step_number} 
                    task={task} 
                    onTaskClick={onTaskClick}
                    onSubtaskClick={onSubtaskClick}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('daily-close');
  const [tasks, setTasks] = useState<CategoryTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<DailyCloseTask | SubStep | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isSubtaskView, setIsSubtaskView] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchDailyCloseTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: DailyCloseTask) => {
    setSelectedTask(task);
    setIsSubtaskView(false);
    setQuickViewOpen(true);
  };

  const handleSubtaskClick = (subtask: SubStep) => {
    setSelectedTask(subtask);
    setIsSubtaskView(true);
    setQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setQuickViewOpen(false);
    setSelectedTask(null);
    setIsSubtaskView(false);
  };

  const handleStatusChange = async (taskId: number, newStatus: string, isSubtask?: boolean, subtaskId?: number) => {
    try {
      // TODO: Add API call to update status
      // const response = await updateTaskStatus(taskId, newStatus, isSubtask, subtaskId);
      
      setTasks(prevTasks => 
        prevTasks.map(category => ({
          ...category,
          tasks: category.tasks.map(task => {
            if (task.step_number === taskId) {
              if (isSubtask && subtaskId) {
                return {
                  ...task,
                  substeps: task.substeps.map(substep =>
                    substep.sub_step_number === subtaskId
                      ? { ...substep, status: newStatus }
                      : substep
                  )
                };
              }
              return { ...task, status: newStatus };
            }
            return task;
          })
        }))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      // TODO: Add error handling/notification
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      }
      return [...prev, filter];
    });
    // TODO: Apply filters to tasks
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ContentContainer>
      <TopNav>
        <NavTab 
          className={activeTab === 'daily-close' ? 'active' : ''}
          onClick={() => setActiveTab('daily-close')}
        >
          Daily Close
        </NavTab>
        <NavTab 
          className={activeTab === 'my-tasks' ? 'active' : ''}
          onClick={() => setActiveTab('my-tasks')}
        >
          My Tasks
        </NavTab>
        <NavTab 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All
        </NavTab>
      </TopNav>

      <MainContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <FilterButton
            onClick={handleFilterClick}
            startIcon={<FilterList />}
            sx={{ ml: -1 }}
          >
            Filter
            {activeFilters.length > 0 && ` (${activeFilters.length})`}
          </FilterButton>
          
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                width: '200px',
                maxHeight: '400px',
                mt: 1,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <MenuItem 
              onClick={() => handleFilterSelect('assigned-to-me')}
              sx={{ fontSize: '0.875rem' }}
            >
              Assigned to me
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('completed')}
              sx={{ fontSize: '0.875rem' }}
            >
              Completed
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('in-progress')}
              sx={{ fontSize: '0.875rem' }}
            >
              In Progress
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('backlog')}
              sx={{ fontSize: '0.875rem' }}
            >
              Backlog
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => handleFilterSelect('high-priority')}
              sx={{ fontSize: '0.875rem' }}
            >
              High Priority
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('medium-priority')}
              sx={{ fontSize: '0.875rem' }}
            >
              Medium Priority
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('low-priority')}
              sx={{ fontSize: '0.875rem' }}
            >
              Low Priority
            </MenuItem>
          </Menu>
        </Box>

        {tasks.map((category) => (
          <CategorySection
            key={category.category}
            category={category}
            onTaskClick={handleTaskClick}
            onSubtaskClick={handleSubtaskClick}
            onStatusChange={handleStatusChange}
          />
        ))}
        
        <TaskQuickView
          open={quickViewOpen}
          onClose={handleQuickViewClose}
          task={selectedTask}
          isSubtask={isSubtaskView}
        />
      </MainContent>
    </ContentContainer>
  );
};

export default Dashboard; 