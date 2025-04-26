import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  ListItemIcon,
  Collapse,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ViewList as TasksIcon,
  Search as SearchIcon,
  GridView as GridIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowRight as ArrowRightIcon,
  KeyboardArrowDown as ArrowIcon
} from '@mui/icons-material';
import PriorityIcon from '../PriorityIcon';
import StatusSelector from '../StatusSelector';
import { CategoryTasks, DailyCloseTask } from '../../services/dailyCloseService';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 320,
  height: '100vh',
  backgroundColor: '#F8F9FA',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter, sans-serif',
  borderRight: '1px solid rgba(0, 0, 0, 0.08)',
}));

const Logo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#F8F9FA',
});

const LogoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const LogoCircle = styled(Box)({
  width: 32,
  height: 32,
  borderRadius: '8px',
  backgroundColor: '#1a73e8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
});

const ActionIcons = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const WorkspaceSection = styled(Box)({
  padding: '16px',
});

const WorkspaceTitle = styled(Typography)({
  fontSize: '12px',
  color: '#6B7280',
  marginBottom: '4px',
});

const CategoryHeader = styled(ListItem)(({ theme }) => ({
  padding: '8px 16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  '& .category-count': {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '13px',
    backgroundColor: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    minWidth: '24px',
    minHeight: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const TaskItem = styled(ListItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: '6px 16px',
  cursor: 'pointer',
  backgroundColor: selected ? '#fff' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? '#fff' : 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiTypography-root': {
    fontSize: '13px',
    fontWeight: selected ? 500 : 400,
  },
  borderRadius: selected ? '4px' : '0',
  margin: selected ? '0 8px' : '0',
}));

const UserSection = styled(Box)({
  padding: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#fff',
});

interface SidebarProps {
  tasks: CategoryTasks[];
  selectedTask: DailyCloseTask | null;
  onTaskSelect: (task: DailyCloseTask) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tasks, selectedTask, onTaskSelect }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <SidebarContainer>
      <Logo>
        <LogoSection>
          <LogoCircle>A</LogoCircle>
          <Typography 
            sx={{ 
              fontWeight: 500,
              fontSize: '15px',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Alpine <ArrowIcon sx={{ fontSize: 18, opacity: 0.5 }} />
          </Typography>
        </LogoSection>
        <ActionIcons>
          <SearchIcon sx={{ fontSize: 20, color: '#6B7280' }} />
          <GridIcon sx={{ fontSize: 20, color: '#6B7280' }} />
        </ActionIcons>
      </Logo>

      <WorkspaceSection>
        <WorkspaceTitle>Workspace</WorkspaceTitle>
      </WorkspaceSection>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {tasks.map((category) => (
            <React.Fragment key={category.category}>
              <CategoryHeader onClick={() => toggleCategory(category.category)}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {expandedCategories.includes(category.category) 
                    ? <ArrowDownIcon sx={{ fontSize: 20 }} />
                    : <ArrowRightIcon sx={{ fontSize: 20 }} />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.category}
                      <span className="category-count">
                        {category.tasks.length}
                      </span>
                    </Box>
                  }
                />
              </CategoryHeader>
              <Collapse in={expandedCategories.includes(category.category)}>
                <List sx={{ py: 0 }}>
                  {category.tasks.map((task) => (
                    <TaskItem 
                      key={task.step_number}
                      selected={selectedTask?.step_number === task.step_number}
                      onClick={() => onTaskSelect(task)}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <PriorityIcon priority={task.priority} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={task.step_name}
                        sx={{ 
                          '& .MuiTypography-root': { 
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }
                        }}
                      />
                      <Box sx={{ ml: 1 }}>
                        <StatusSelector
                          currentStatus={task.status}
                          onStatusChange={() => {}}
                          size="small"
                        />
                      </Box>
                    </TaskItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>

      <UserSection>
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#E5E7EB', color: '#374151', fontSize: '14px' }}>
          SS
        </Avatar>
        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
          Surya Suresh
        </Typography>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar; 