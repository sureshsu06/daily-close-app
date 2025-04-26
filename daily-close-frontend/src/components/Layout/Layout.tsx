import React, { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from './Sidebar';
import ChatPanel from '../Chat/ChatPanel';
import { CategoryTasks, DailyCloseTask } from '../../services/dailyCloseService';

const LayoutContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
});

const MainContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  backgroundColor: '#FFFFFF',
});

interface LayoutProps {
  tasks: CategoryTasks[];
  children: ReactNode;
  onTaskSelect: (task: DailyCloseTask) => void;
}

const Layout: React.FC<LayoutProps> = ({ tasks, children, onTaskSelect }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <LayoutContainer>
      <Sidebar tasks={tasks} onTaskSelect={onTaskSelect} selectedTask={null} />
      <MainContent>
        {children}
      </MainContent>
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </LayoutContainer>
  );
};

export default Layout; 