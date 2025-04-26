import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ActionsView from './pages/ActionsView';
import FileUpload from './pages/FileUpload';
import Layout from './components/Layout/Layout';
import { fetchDailyCloseTasks, CategoryTasks, DailyCloseTask } from './services/dailyCloseService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [tasks, setTasks] = useState<CategoryTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<DailyCloseTask | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchDailyCloseTasks();
        console.log('Loaded tasks:', data);
        setTasks(data);
        // Select the first task by default if none is selected
        if (!selectedTask && data.length > 0 && data[0].tasks.length > 0) {
          setSelectedTask(data[0].tasks[0]);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleTaskSelect = (task: DailyCloseTask) => {
    console.log('App level task selected:', task);
    setSelectedTask(task);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Layout tasks={tasks} onTaskSelect={handleTaskSelect} selectedTask={selectedTask}>
            <Routes>
              <Route path="/" element={<Dashboard selectedTask={selectedTask} />} />
              <Route path="/actions" element={<ActionsView />} />
              <Route path="/upload" element={<FileUpload />} />
            </Routes>
          </Layout>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
