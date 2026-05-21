export interface DashboardExpenseInterfaceData {
  id: number;
  date: string;
  voucher: any;
  name: string;
  category: string;
  status: string;
  amount: number;
}
export const dashboardExpenseData: DashboardExpenseInterfaceData[] = [
  {
    id: 1,
    date: '11/12/2024',
    voucher: '850390',
    name: 'Stationery purchase',
    category: 'Office Supplies',
    status: 'Complete',
    amount: 1282,
  },
  {
    id: 2,
    date: '12/12/2024',
    voucher: '850391',
    name: 'Furniture purchase',
    category: 'Office Furniture',
    status: 'Partial',
    amount: 1382,
  },
  {
    id: 3,
    date: '13/12/2024',
    voucher: '850392',
    name: 'Computer equipment',
    category: 'Electronics',
    status: 'Partial',
    amount: 1482,
  },
  {
    id: 4,
    date: '14/12/2024',
    voucher: '850393',
    name: 'Cleaning supplies',
    category: 'Cleaning',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 5,
    date: '15/12/2024',
    voucher: '850394',
    name: 'Office renovation',
    category: 'Construction',
    status: 'Complete',
    amount: 1582,
  },
  {
    id: 6,
    date: '16/12/2024',
    voucher: '850393',
    name: 'Employee training',
    category: 'Training',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 7,
    date: '14/12/2024',
    voucher: '850393',
    name: 'Cleaning supplies',
    category: 'Cleaning',
    status: 'Unpaid',
    amount: 1582,
  },
];
