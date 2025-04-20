import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ViewList as TasksIcon,
  TrendingUp as PnLIcon,
  NotificationsActive as ActionsIcon,
  People as TeamsIcon,
  Person as UsersIcon,
  Book as PlaybooksIcon,
  Help as HelpIcon,
  Settings as AdminIcon,
  KeyboardArrowDown as ArrowIcon
} from '@mui/icons-material';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 200,
  height: '100vh',
  backgroundColor: '#F8FAFB',
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  fontFamily: 'Inter, sans-serif',
  borderRight: '1px solid rgba(0, 0, 0, 0.08)',
}));

const Logo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
  paddingLeft: '8px',
});

const LogoCircle = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '6px',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
});

const NavList = styled(List)({
  padding: '4px 0',
  width: '100%',
  '& .MuiListItem-root': {
    borderRadius: '6px',
    padding: '6px 8px',
    marginBottom: '2px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&.active': {
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },
  },
});

const NavItem = styled(ListItem)({
  cursor: 'pointer',
});

const CompanyName = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '15px',
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const SectionTitle = styled(Typography)({
  fontSize: '13px',
  fontWeight: 500,
  color: '#6B7280',
  padding: '0 8px',
  marginTop: '16px',
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const UserAvatar = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: '#E5E7EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  color: '#4B5563',
  fontWeight: 500,
});

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { text: 'Actions', path: '/actions', icon: <ActionsIcon sx={{ fontSize: 16 }} /> },
  ];

  const workspaceItems = [
    { text: 'Daily Close Tasks', path: '/', icon: <TasksIcon sx={{ fontSize: 16 }} /> },
    { text: 'Daily P&L', path: '/pnl', icon: <PnLIcon sx={{ fontSize: 16 }} /> },
    { text: 'Teams', path: '/teams', icon: <TeamsIcon sx={{ fontSize: 16 }} /> },
    { text: 'Users', path: '/users', icon: <UsersIcon sx={{ fontSize: 16 }} /> },
  ];

  const bottomNavItems = [
    { text: 'Playbooks', path: '/playbooks', icon: <PlaybooksIcon sx={{ fontSize: 18 }} /> },
    { text: 'Help', path: '/help', icon: <HelpIcon sx={{ fontSize: 18 }} /> },
    { text: 'Admin', path: '/admin', icon: <AdminIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <SidebarContainer>
      <Logo>
        <LogoCircle>A</LogoCircle>
        <CompanyName>
          Alpine <ArrowIcon sx={{ fontSize: 18, opacity: 0.5 }} />
        </CompanyName>
      </Logo>

      <NavList>
        {mainNavItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: { 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: location.pathname === item.path ? 500 : 400,
                  fontSize: '14px',
                }
              }}
            />
          </NavItem>
        ))}
      </NavList>

      <SectionTitle>
        Workspace
      </SectionTitle>

      <NavList>
        {workspaceItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: { 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: location.pathname === item.path ? 500 : 400,
                  fontSize: '14px',
                }
              }}
            />
          </NavItem>
        ))}
      </NavList>

      <Box sx={{ flexGrow: 1 }} />

      <NavList>
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: { 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: location.pathname === item.path ? 500 : 400,
                  fontSize: '14px',
                }
              }}
            />
          </NavItem>
        ))}
        <NavItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <UserAvatar>ML</UserAvatar>
          </ListItemIcon>
          <ListItemText 
            primary="Marie Landau"
            primaryTypographyProps={{
              sx: { 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              }
            }}
          />
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 