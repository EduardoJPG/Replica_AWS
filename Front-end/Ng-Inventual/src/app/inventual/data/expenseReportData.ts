export interface ExpenseReportInterfaceData {
  id: number;
  date: string;
  warehouse: string;
  category: string;
  expenseType: string;
  status: string;
  amount: number;
}
export const expenseReportData: ExpenseReportInterfaceData[] = [
    {
        id: 1,
        date: '01 Jan 2024',
        warehouse: 'Warehouse 1',
        category: 'Electric bulb',
        expenseType: 'Direct',
        status: 'Completed',
        amount: 582.00
    },
    {
        id: 2,
        date: '02 Jan 2024',
        warehouse: 'Warehouse 2',
        category: 'LED Light',
        expenseType: 'Indirect',
        status: 'Partial',
        amount: 720.50
    },
    {
        id: 3,
        date: '03 Jan 2024',
        warehouse: 'Warehouse 3',
        category: 'Multi plugs',
        expenseType: 'Direct',
        status: 'Completed',
        amount: 430.25
    },
    {
        id: 4,
        date: '04 Jan 2024',
        warehouse: 'Warehouse 4',
        category: 'Desktop repair',
        expenseType: 'Indirect',
        status: 'Due',
        amount: 320.75
    },
    {
        id: 5,
        date: '05 Jan 2024',
        warehouse: 'Warehouse 5',
        category: 'Smart Bulb',
        expenseType: 'Direct',
        status: 'Completed',
        amount: 890.00
    },
    {
        id: 6,
        date: '06 Jan 2024',
        warehouse: 'Warehouse 6',
        category: 'Chair repair',
        expenseType: 'Indirect',
        status: 'Partial',
        amount: 550.75
    },
    {
        id: 7,
        date: '07 Jan 2024',
        warehouse: 'Warehouse 7',
        category: 'Employee salary',
        expenseType: 'Direct',
        status: 'Due',
        amount: 280.50
    },
    {
        id: 8,
        date: '08 Jan 2024',
        warehouse: 'Warehouse 8',
        category: 'Medical bill',
        expenseType: 'Indirect',
        status: 'Completed',
        amount: 640.25
    },
    {
        id: 9,
        date: '09 Jan 2024',
        warehouse: 'Warehouse 9',
        category: 'Neon Sign',
        expenseType: 'Direct',
        status: 'Partial',
        amount: 750.00
    },
    {
        id: 10,
        date: '10 Jan 2024',
        warehouse: 'Warehouse 10',
        category: 'Floodlight',
        expenseType: 'Indirect',
        status: 'Due',
        amount: 380.50
    },
    {
        id: 11,
        date: '11 Jan 2024',
        warehouse: 'Warehouse 11',
        category: 'Office rent',
        expenseType: 'Direct',
        status: 'Completed',
        amount: 430.75
    },
    {
        id: 12,
        date: '12 Jan 2024',
        warehouse: 'Warehouse 12',
        category: 'Chandelier',
        expenseType: 'Indirect',
        status: 'Partial',
        amount: 620.00
    },
    {
        id: 13,
        date: '13 Jan 2024',
        warehouse: 'Warehouse 13',
        category: 'Track Lighting',
        expenseType: 'Direct',
        status: 'Due',
        amount: 590.25
    },
    {
        id: 14,
        date: '14 Jan 2024',
        warehouse: 'Warehouse 14',
        category: 'Ceiling Fan with Light',
        expenseType: 'Indirect',
        status: 'Completed',
        amount: 720.50
    },
    {
        id: 15,
        date: '15 Jan 2024',
        warehouse: 'Warehouse 15',
        category: 'Hanging Pendant Light',
        expenseType: 'Direct',
        status: 'Partial',
        amount: 830.00
    }
];
