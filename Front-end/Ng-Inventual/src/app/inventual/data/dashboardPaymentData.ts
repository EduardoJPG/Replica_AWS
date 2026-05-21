export interface DashboardPaymentInterfaceData {
  id: number;
  date: string;
  reference: any;
  payment: string;
  status: string;
  amount: number;
}
export const dashboardPaymentData: DashboardPaymentInterfaceData[] = [
  {
    id: 1,
    date: '05/12/2024',
    reference: '3850390',
    payment: 'Bank',
    status: 'Complete',
    amount: 1282,
  },
  {
    id: 2,
    date: '06/12/2024',
    reference: '3850391',
    payment: 'Cash',
    status: 'Partial',
    amount: 1382,
  },
  {
    id: 3,
    date: '07/12/2024',
    reference: '3850392',
    payment: 'Cash',
    status: 'Partial',
    amount: 1482,
  },
  {
    id: 4,
    date: '08/12/2024',
    reference: '3850393',
    payment: '----',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 5,
    date: '09/12/2024',
    reference: '3850394',
    payment: 'Card',
    status: 'Complete',
    amount: 1582,
  },
  {
    id: 6,
    date: '10/12/2024',
    reference: '3850393',
    payment: '----',
    status: 'Unpaid',
    amount: 1582,
  },
  {
    id: 7,
    date: '07/12/2024',
    reference: '3850392',
    payment: 'Cash',
    status: 'Partial',
    amount: 1482,
  },
];
