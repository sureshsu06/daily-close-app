import Papa from 'papaparse';
import axios from 'axios';

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
  required_integrations: string;
  prepared_by?: string;
  reviewed_by?: string;
}

export interface SubStep {
  main_step: string;
  main_step_name: string;
  sub_step_number: number;
  sub_step_name: string;
  sub_step_description: string;
  estimated_time_minutes: number;
  requires_judgment: boolean;
  requires_system_access: boolean;
  requires_external_data: boolean;
  status: string;
  assigned_to: string;
  prepared_by: string;
  reviewed_by: string;
}

interface CSVTask {
  category: string;
  step_number: string;
  step_name: string;
  description: string;
  assigned_to: string;
  status: string;
  priority: string;
  estimated_time_minutes: string;
  requires_approval: string;
  integration_required: string;
  required_integrations: string;
}

export interface CategoryTasks {
  category: string;
  tasks: DailyCloseTask[];
}

const API_BASE_URL = 'http://localhost:3001/api/data';

const mockData = `category,step_number,step_name,description,assigned_to,status,priority,estimated_time_minutes,requires_approval,integration_required,required_integrations
Cash,1,Reconcile cash accounts with bank statements,Reconcile cash accounts,Pip,Not Started,High,10,Yes,Yes,"Bank"
Cash,2,Record India i/c cash tranfer,Process India intercompany cash transfers. Get bank statement from India and use FX rate to record the JE.,Pip,Not Started,High,10,Yes,Yes,"Bank"
Cash,3,Record all cash transaction not captured during the month,Process pending cash transactions,Pip,Not Started,High,10,Yes,No,""
Cash,4,Record intercompany cash transfers/fundings not captured during the month,Process intercompany transfers,Pip,Not Started,High,10,Yes,No,""
Cash,5,Record all cash transactions not captured during the month,Process remaining cash transactions,Pip,Not Started,High,10,Yes,No,""
Cash,6,To make sure all cash account balance and statement saved,Save bank statements,Pip,Not Started,High,10,Yes,No,""
Cash,7,All payments for India,Process India payments,Pip,Not Started,High,15,Yes,Yes,"Bank"
Cash,8,Save Stiffel Bank Statement,Save bank statements,Pip,Not Started,Low,5,No,No,""
Cash,9,Fund Europe Subsidiary,Process European funding,Pip,Not Started,High,15,Yes,No,""
AR,1,Record all remaining customer payments,Process outstanding customer payments,Pip,Not Started,High,10,Yes,No,""
AR,2,Record all remaining customer invoices,Process pending customer invoices,Pip,Not Started,High,10,Yes,No,""
AR,3,Review AR aging for any new items and verify if an invoice needs to be sent out to the customers,Review aging and identify invoicing needs,Pip,Not Started,High,10,Yes,No,""
AR,4,Check with Amanda if any sales orders are executed close to month-end for which an invoice needs to be created,Verify month-end sales orders for invoicing,Human,Not Started,Medium,15,Yes,No,""
AR,5,Accrue True up for Revenue,Process revenue true-up accruals,Pip,Not Started,High,15,Yes,No,""
Accruals,1,Record Deloitte fee accrual,Process Deloitte fee accruals,Pip,Not Started,Medium,5,Yes,No,""
Accruals,2,Accrue Q1 commissions,Process Q1 commission accruals,Pip,Not Started,Medium,15,Yes,No,""
Accruals,3,Record accrued expense,Process expense accruals,Pip,Not Started,Medium,10,Yes,No,""
Accruals,4,Record accrued bonus (if applicable),Process bonus accruals if needed,Pip,Not Started,Medium,10,Yes,No,""
Accruals,5,Exclusive Networks Accrual,Process Exclusive Networks accrual,Pip,Not Started,Medium,10,Yes,No,""
Expense Reports,1,Post a clearing JE in Germany to clear out cash and expense report,Clear German expense reports,Pip,Not Started,Medium,15,Yes,No,""
Expense Reports,2,Post available expense reports on hand to GL,Process pending expense reports,Pip,Not Started,Medium,15,Yes,No,""
Expense Reports,3,Post available expense reports on hand to GL,Process additional expense reports,Pip,Not Started,Medium,15,Yes,No,""
Expense Reports,4,Accrue T&E (if material),Process material T&E accruals,Pip,Not Started,Medium,10,Yes,No,""
Expense Reports,5,Accrue T&E (if material),Process additional material T&E accruals,Pip,Not Started,Medium,10,Yes,No,""
Payroll,1,Download payroll JE from Papaya and post to NS,Process payroll journal entries from Papaya,Pip,Not Started,High,10,Yes,No,""
Payroll,2,Check with HR if there are any terminations during the month and related severance that needs to be accrued,Review terminations and severance accruals,Human,Not Started,High,15,Yes,No,""
Payroll,3,Reconcile/review balance sheet payroll GL,Salary expenses reconciled with previous month taking into consideration addition/deletion/variation in salary components like incentive or annual salary increase etc,Pip,Not Started,High,15,Yes,No,""
Payroll,4,PTO accrual entries,Process PTO accruals,Pip,Not Started,Medium,10,Yes,No,""
Financial Statements,1,Department check for all transactions of Jan to Mar,Review departmental transactions,Human,Not Started,High,20,Yes,No,""
Financial Statements,2,Perform Flux analysis and record adjusting JEs,Review and adjust financial statements,Pip,Not Started,High,30,Yes,No,""
Financial Statements,3,Present Flux analysis to management,Present financial analysis,Human,Not Started,High,20,Yes,No,""
Financial Statements,4,Ensure 2024 and 2025 entries are all recorded in appropriate period,Verify proper period recording,Human,Not Started,High,20,Yes,No,""
AP,1,Send a reminder to the company to submit T&E and AP bills on time,Send reminder for T&E and AP bill submission,Pip,Not Started,High,5,No,No,""
AP,2,Send a reminder to the Paul hosting LLC/USA Inc for unbilled amount for the month + Numerera and Baker Tilly,Follow up on unbilled amounts with vendors,Pip,Not Started,High,5,No,No,""
AP,3,Make sure all AP on hand is posted to GL,Verify AP postings to general ledger,Pip,Not Started,High,10,Yes,No,""
Intercompany,1,Share I/C invoice base on transfer pricing agreements,Process intercompany invoices,Pip,Not Started,High,15,Yes,No,""
Intercompany,2,Record I/C AR and AP based on transfer pricing agreements for India & Germany,Process India/Germany intercompany transactions,Pip,Not Started,High,15,Yes,No,""
Intercompany,3,Run NetSuite close process and record Elimination and Consolidation JEs,Process consolidation entries,Pip,Not Started,High,20,Yes,Yes,"NetSuite"
Equity,1,Record stock option exercises if any,Record stock option exercises,Pip,Not Started,Medium,15,Yes,No,""
Equity,2,Record SBC Quarterly - Need to catch-up 9 months of SBC expense,Update stock-based compensation,Pip,Not Started,High,30,Yes,No,""
Equity,3,Share exercise details from Carta,Record stock option exercises,Pip,Not Started,Medium,10,Yes,No,""
Expense Reports,6,Upload CC activity to GL,Process credit card transactions,Pip,Not Started,Medium,10,Yes,No,""
Amortisations,1,Update amortisation schedule historically booked under legacy departments,Update historical amortization schedules,Pip,Not Started,Medium,20,Yes,No,""
Leases,1,Post Lease accounting JEs - to catch-up for 9 months in Sept 24,Update lease accounting entries,Pip,Not Started,Medium,30,Yes,No,""
Revenue,1,Recognize revenue - post all revenue JEs,Process revenue recognition entries,Pip,Not Started,High,15,Yes,Yes,""
Revenue,2,Reconcile deferred revenue balance,Verify deferred revenue balance with schedules,Pip,Not Started,High,15,Yes,Yes,""
Revenue,3,Reconcile deferred revenue,Process deferred revenue,Pip,Not Started,High,15,Yes,Yes,""
PPDs & Fixed Assets,1,Run Prepaids and Fixed Assets amortizations templates (depreciation),Process prepaid and fixed asset amortization,Pip,Not Started,Medium,20,Yes,No,""
COGS,1,Perform COGS allocation - all subs - hosting fees,Allocate COGS across subsidiaries,Pip,Not Started,High,20,Yes,No,""
Payroll,5,Bonus Reconciliation 2024,Reconcile 2024 bonus payments,Pip,Not Started,High,20,Yes,No,""
Payroll,6,Comm Reconciliation 2024,Reconcile 2024 commissions,Pip,Not Started,High,20,Yes,No,""`;

export const fetchDailyCloseTasks = async (): Promise<CategoryTasks[]> => {
  // Parse CSV string
  const parsedData = Papa.parse(mockData, { header: true }).data as CSVTask[];

  // Group tasks by category
  const tasksByCategory = parsedData.reduce((acc: { [key: string]: DailyCloseTask[] }, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    // Convert string values to proper types
    const processedTask: DailyCloseTask = {
      category: task.category,
      step_number: parseInt(task.step_number),
      step_name: task.step_name,
      description: task.description,
      assigned_to: task.assigned_to,
      status: task.status,
      priority: task.priority,
      estimated_time_minutes: parseInt(task.estimated_time_minutes),
      requires_approval: task.requires_approval === 'Yes',
      integration_required: task.integration_required === 'Yes',
      required_integrations: task.required_integrations,
      prepared_by: task.assigned_to === 'Pip' ? 'Pip' : 'Not Set',
      reviewed_by: task.assigned_to === 'Human' ? 'Human' : 'Not Set'
    };
    acc[task.category].push(processedTask);
    return acc;
  }, {});

  // Convert to array format
  return Object.entries(tasksByCategory).map(([category, tasks]) => ({
    category,
    tasks: tasks.sort((a, b) => a.step_number - b.step_number)
  }));
}; 