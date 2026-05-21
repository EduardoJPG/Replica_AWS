export interface DashboardSaleInterfaceData {
  id: number;
  date: string;
  reference: any;
  customer: string;
  payment: string;
  status: string;
  amount: number;
}
export const dashboardSaleData: DashboardSaleInterfaceData[] = [
  {
    id: 1,
    date: '26/12/2024',
    reference: 'S-920873850390',
    customer: 'Walk - in - customer',
    payment: 'Bank',
    status: 'Complete',
    amount: 1282,
  },
  {
    id: 2,
    date: '27/12/2024',
    reference: 'S-920873850391',
    customer: 'Mitchel Stark',
    payment: 'Cash',
    status: 'Partial',
    amount: 1382,
  },
  {
    id: 3,
    date: '28/12/2024',
    reference: 'S-920873850392',
    customer: 'Walk - in - customer',
    payment: 'Cash',
    status: 'Partial',
    amount: 1482,
  },
  {
    id: 4,
    date: '29/12/2024',
    reference: 'S-920873850393',
    customer: 'David Warner',
    payment: '----',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 5,
    date: '30/12/2024',
    reference: 'S-920873850394',
    customer: 'Walk - in - customer',
    payment: 'Bank',
    status: 'Complete',
    amount: 1582,
  },
  {
    id: 6,
    date: '31/12/2024',
    reference: 'S-920873850393',
    customer: 'David Warner',
    payment: '----',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 7,
    date: '28/12/2024',
    reference: 'S-920873850392',
    customer: 'Walk - in - customer',
    payment: 'Cash',
    status: 'Partial',
    amount: 1482,
  },
];
