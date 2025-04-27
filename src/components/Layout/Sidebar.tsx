import React, { useState, useRef } from 'react';
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
  Avatar,
  ListSubheader,
  ButtonBase
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ViewList as TasksIcon,
  Search as SearchIcon,
  GridView as GridIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowRight as ArrowRightIcon,
  KeyboardArrowDown as ArrowIcon,
  AccountBalance as FinancialsIcon,
  Description as ContractsIcon,
  EventNote as SchedulesIcon,
  BusinessCenter as BusinessModelIcon,
  CalendarMonth as MonthlyCloseIcon,
  Inbox as InboxIcon,
  AssignmentTurnedIn as MyTasksIcon
} from '@mui/icons-material';
import PriorityIcon from '../PriorityIcon';
import StatusSelector from '../StatusSelector';
import { CategoryTasks, DailyCloseTask } from '../../services/dailyCloseService';
import LogoImg from '../../assets/logo.svg';

const SidebarContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  backgroundColor: '#F8F9FA',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter, sans-serif',
  position: 'relative',
  // borderRight removed for borderless look
}));

const ResizeHandle = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '6px',
  height: '100%',
  cursor: 'col-resize',
  zIndex: 10,
  userSelect: 'none',
  background: 'transparent',
  transition: 'background 0.2s',
  '&:hover': {
    background: 'rgba(0,0,0,0.07)',
  },
});

const Logo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  backgroundColor: '#F8F9FA',
});

const LogoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingLeft: '8px',
});

const LogoCircle = styled(Box)({
  width: 32,
  height: 32,
  borderRadius: '8px',
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
  position: 'relative',
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    flex: 1,
  },
  '& .category-count': {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.text.secondary,
    fontSize: '12px',
    backgroundColor: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    minWidth: '24px',
    height: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
}));

const TaskItem = styled(ListItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: '4px 16px',
  cursor: 'pointer',
  backgroundColor: selected ? '#fff' : 'transparent',
  position: 'relative',
  minHeight: '32px',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: selected ? '#fff' : 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiTypography-root': {
    fontSize: '12px',
    fontWeight: selected ? 500 : 400,
    flex: 1,
  },
  borderRadius: selected ? '4px' : '0',
  margin: selected ? '0 8px' : '0',
  '& .MuiListItemIcon-root': {
    minWidth: '32px',
    marginRight: '8px',
  },
  marginBottom: 0,
}));

const UserSection = styled(Box)({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#fff',
  minHeight: '64px',
});

interface SidebarProps {
  tasks: CategoryTasks[];
  selectedTask: DailyCloseTask | null;
  onTaskSelect: (task: DailyCloseTask) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tasks, selectedTask, onTaskSelect }) => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const resizing = useRef(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedParents, setExpandedParents] = useState<{ [key: string]: boolean }>({
    'Workspace': true,
    'Monthly Close': true,
    'Financials': false,
    'Contracts': false,
    'Schedules': false,
    'Business Model': false,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleParent = (parent: string) => {
    setExpandedParents(prev => ({ ...prev, [parent]: !prev[parent] }));
  };

  // Common style for parent headers
  const parentHeaderSx = {
    display: 'flex',
    alignItems: 'center',
    bgcolor: 'inherit',
    color: '#000',
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif',
    pl: 2,
    pb: 0.5,
    pt: 0.5,
    minHeight: 40,
    cursor: 'pointer',
    letterSpacing: 0,
    border: 'none',
    boxShadow: 'none',
    background: 'none',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  };

  // --- Sidebar Resize Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    resizing.current = true;
    document.body.style.cursor = 'col-resize';
  };
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing.current) {
        const newWidth = Math.max(160, Math.min(400, e.clientX));
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      resizing.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <SidebarContainer style={{ width: sidebarWidth }}>
      <ResizeHandle onMouseDown={handleMouseDown} />
      <Logo>
        <LogoSection>
          <LogoCircle>
            <img src={LogoImg} alt="Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          </LogoCircle>
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

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {/* Inbox and My Tasks */}
          <ButtonBase
            sx={{
              pl: 2.5,
              pr: 1,
              py: 0.5,
              minHeight: 36,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderRadius: 1,
              textAlign: 'left',
              mb: 0,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <InboxIcon sx={{ fontSize: 18, color: '#000', minWidth: 32, mr: 1 }} />
            <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', fontWeight: 400, flex: 1 }}>Inbox</span>
            <Box sx={{
              bgcolor: '#18191C', color: '#fff', borderRadius: 2, px: 0.8, fontSize: 11, fontWeight: 500, ml: 1, minWidth: 22, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>99+</Box>
          </ButtonBase>
          <ButtonBase
            sx={{
              pl: 2.5,
              pr: 1,
              py: 0.5,
              minHeight: 36,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderRadius: 1,
              textAlign: 'left',
              mb: 0,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <MyTasksIcon sx={{ fontSize: 18, color: '#000', minWidth: 32, mr: 1 }} />
            <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', fontWeight: 400, flex: 1 }}>My Tasks</span>
          </ButtonBase>

          {/* Workspace Parent */}
          <ListSubheader
            sx={{
              ...parentHeaderSx,
              position: 'static',
              fontSize: 13,
              fontWeight: 550,
              pl: 3,
              pb: 0.5,
              pt: 0.5,
              color: '#6B7280',
            }}
            onClick={() => toggleParent('Workspace')}
            component="div"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{}}>Workspace</span>
              {expandedParents['Workspace'] ? (
                <ArrowDownIcon sx={{ fontSize: 18, ml: 1, color: '#6B7280' }} />
              ) : (
                <ArrowRightIcon sx={{ fontSize: 18, ml: 1, color: '#6B7280' }} />
              )}
            </Box>
          </ListSubheader>
          {expandedParents['Workspace'] && (
            <>
              {/* Indented parent tasks */}
              <Box>
                <ButtonBase
                  sx={{
                    pl: 3,
                    pr: 1,
                    py: 0.5,
                    minHeight: 36,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 1,
                    textAlign: 'left',
                  }}
                  onClick={() => toggleParent('Financials')}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <FinancialsIcon sx={{ fontSize: 18, color: '#000' }} />
                  </ListItemIcon>
                  <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', flex: 1, display: 'flex', alignItems: 'center' }}>
                    Financials
                    {expandedParents['Financials'] ? <ArrowDownIcon sx={{ fontSize: 18, ml: 1 }} /> : <ArrowRightIcon sx={{ fontSize: 18, ml: 1 }} />}
                  </span>
                </ButtonBase>
                <ButtonBase
                  sx={{
                    pl: 3,
                    pr: 1,
                    py: 0.5,
                    minHeight: 36,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 1,
                    textAlign: 'left',
                  }}
                  onClick={() => toggleParent('Contracts')}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ContractsIcon sx={{ fontSize: 18, color: '#000' }} />
                  </ListItemIcon>
                  <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', flex: 1, display: 'flex', alignItems: 'center' }}>
                    Contracts
                    {expandedParents['Contracts'] ? <ArrowDownIcon sx={{ fontSize: 18, ml: 1 }} /> : <ArrowRightIcon sx={{ fontSize: 18, ml: 1 }} />}
                  </span>
                </ButtonBase>
                <ButtonBase
                  sx={{
                    pl: 3,
                    pr: 1,
                    py: 0.5,
                    minHeight: 36,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 1,
                    textAlign: 'left',
                  }}
                  onClick={() => toggleParent('Schedules')}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <SchedulesIcon sx={{ fontSize: 18, color: '#000' }} />
                  </ListItemIcon>
                  <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', flex: 1, display: 'flex', alignItems: 'center' }}>
                    Schedules
                    {expandedParents['Schedules'] ? <ArrowDownIcon sx={{ fontSize: 18, ml: 1 }} /> : <ArrowRightIcon sx={{ fontSize: 18, ml: 1 }} />}
                  </span>
                </ButtonBase>
                <ButtonBase
                  sx={{
                    pl: 3,
                    pr: 1,
                    py: 0.5,
                    minHeight: 36,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 1,
                    textAlign: 'left',
                  }}
                  onClick={() => toggleParent('Business Model')}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <BusinessModelIcon sx={{ fontSize: 18, color: '#000' }} />
                  </ListItemIcon>
                  <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', flex: 1, display: 'flex', alignItems: 'center' }}>
                    Business Model
                    {expandedParents['Business Model'] ? <ArrowDownIcon sx={{ fontSize: 18, ml: 1 }} /> : <ArrowRightIcon sx={{ fontSize: 18, ml: 1 }} />}
                  </span>
                </ButtonBase>
                <ButtonBase
                  sx={{
                    pl: 3,
                    pr: 1,
                    py: 0.5,
                    minHeight: 36,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 1,
                    textAlign: 'left',
                  }}
                  onClick={() => toggleParent('Monthly Close')}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <MonthlyCloseIcon sx={{ fontSize: 18, color: '#000' }} />
                  </ListItemIcon>
                  <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#000', flex: 1, display: 'flex', alignItems: 'center' }}>
                    Monthly Close
                    {expandedParents['Monthly Close'] ? <ArrowDownIcon sx={{ fontSize: 18, ml: 1 }} /> : <ArrowRightIcon sx={{ fontSize: 18, ml: 1 }} />}
                  </span>
                </ButtonBase>
              </Box>
            </>
          )}

          {/* Monthly Close Parent */}
          {expandedParents['Monthly Close'] && (
            <>
              {tasks.map((category) => (
                <React.Fragment key={category.category}>
                  <CategoryHeader 
                    onClick={() => toggleCategory(category.category)}
                    sx={{ pl: 7 }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 14,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      flex: 1,
                    }}>
                      {category.category}
                      {expandedCategories.includes(category.category) 
                        ? <ArrowDownIcon sx={{ fontSize: 20, ml: 1 }} />
                        : <ArrowRightIcon sx={{ fontSize: 20, ml: 1 }} />
                      }
                      <span className="category-count">
                        {category.tasks.length}
                      </span>
                    </span>
                  </CategoryHeader>
                  <Collapse in={expandedCategories.includes(category.category)}>
                    <List sx={{ py: 0, gap: 0 }}>
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
                              pr: 5,
                              '& .MuiTypography-root': { 
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                              }
                            }}
                          />
                          <Box sx={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)' }}>
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
            </>
          )}
        </List>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar; 