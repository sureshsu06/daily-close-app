import Papa from 'papaparse';
import fs from 'fs/promises';
import path from 'path';

export interface DailyCloseTask {
  category: string;
  step_number: number;
  step_name: string;
  description: string;
  assigned_to: string;
  status: string;
  priority: string;
  estimated_time_minutes: number;
  requires_approval: boolean;
  integration_required: boolean;
  substeps: SubStep[];
}

export interface SubStep {
  main_step: string;
  sub_step_number: number;
  sub_step_name: string;
  sub_step_description: string;
  estimated_time_minutes: number;
  requires_judgment: boolean;
  requires_system_access: boolean;
  requires_external_data: boolean;
  status: string;
  assigned_to: string;
}

export interface CategoryTasks {
  category: string;
  tasks: DailyCloseTask[];
}

export const processDailyCloseTasks = async (stepsCSV: string, substepsCSV: string): Promise<CategoryTasks[]> => {
  // Parse CSVs
  const steps = Papa.parse(stepsCSV, { header: true }).data as DailyCloseTask[];
  const substeps = Papa.parse(substepsCSV, { header: true }).data as SubStep[];

  // Group tasks by category
  const tasksByCategory = steps.reduce((acc: { [key: string]: DailyCloseTask[] }, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push({
      ...task,
      substeps: substeps.filter(substep => substep.main_step === task.step_name)
    });
    return acc;
  }, {});

  // Convert to array format
  return Object.entries(tasksByCategory).map(([category, tasks]) => ({
    category,
    tasks: tasks.sort((a, b) => a.step_number - b.step_number)
  }));
};

export const fetchDailyCloseTasks = async (): Promise<CategoryTasks[]> => {
  try {
    const response = await fetch('http://localhost:3001/api/daily-close-tasks');
    const data = await response.json();
    
    return processDailyCloseTasks(data.steps, data.substeps);
  } catch (error) {
    console.error('Error fetching daily close tasks:', error);
    return [];
  }
}; 