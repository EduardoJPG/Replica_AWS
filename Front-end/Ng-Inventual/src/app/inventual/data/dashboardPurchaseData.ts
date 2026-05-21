export interface DashboardPurchaseInterfaceData {
  id: number;
  date: string;
  reference: any;
  supplier: string;
  payment: string;
  status: string;
  amount: number;
}
export const dashboardPurchaseData: DashboardPurchaseInterfaceData[] = [
  {
    id: 1,
    date: '22/12/2024',
    reference: 'S-920873850390',
    supplier: 'Peter',
    payment: 'Bank',
    status: 'Complete',
    amount: 1282,
  },
  {
    id: 2,
    date: '23/12/2024',
    reference: 'S-920873850391',
    supplier: 'Melinda',
    payment: 'Cash',
    status: 'Partial',
    amount: 1382,
  },
  {
    id: 3,
    date: '24/12/2024',
    reference: 'S-920873850392',
    supplier: 'Sunaina',
    payment: 'Cash',
    status: 'Partial',
    amount: 1482,
  },
  {
    id: 4,
    date: '25/12/2024',
    reference: 'S-920873850393',
    supplier: 'David Warner',
    payment: '----',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 5,
    date: '26/12/2024',
    reference: 'S-920873850394',
    supplier: 'Evarton',
    payment: 'Bank',
    status: 'Complete',
    amount: 1582,
  },
  {
    id: 6,
    date: '27/12/2024',
    reference: 'S-920873850393',
    supplier: 'David Warner',
    payment: '----',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 7,
    date: '24/12/2024',
    reference: 'S-920873850392',
    supplier: 'Sunaina',
    payment: 'Cash',
    status: 'Partial',
    amount: 1482,
  },
];
