export interface DashboardReturnsInterfaceData {
  id: number;
  date: string;
  voucher: any;
  customer: any;
  biller: string;
  remark: string;
  amount: number;
}
export const dashboardReturnsData: DashboardReturnsInterfaceData[] = [
  {
    id: 1,
    date: '02/12/2024',
    voucher: 'S-920873850390',
    customer: 'Josheph',
    biller: 'Nancy R. Borgman',
    remark: 'Date Expired',
    amount: 1282,
  },
  {
    id: 2,
    date: '03/12/2024',
    voucher: 'S-920873850391',
    customer: 'Adam',
    biller: 'Joseph Amarho',
    remark: 'N/A',
    amount: 1382,
  },
  {
    id: 3,
    date: '04/12/2024',
    voucher: 'S-920873850392',
    customer: 'Tara Redman',
    biller: 'Dean Richards',
    remark: 'Quality less',
    amount: 1482,
  },
  {
    id: 4,
    date: '05/12/2024',
    voucher: 'S-920873850393',
    customer: 'David Warner',
    biller: 'Peter',
    remark: 'Duplicate',
    amount: 1582,
  },
  {
    id: 5,
    date: '06/12/2024',
    voucher: 'S-920873850394',
    customer: 'Robert',
    biller: 'Steve',
    remark: 'Date Expired',
    amount: 1582,
  },
  {
    id: 6,
    date: '07/12/2024',
    voucher: 'S-920873850393',
    customer: 'David Warner',
    biller: 'Dr. Banner',
    remark: 'Quality less',
    amount: 1582,
  },
  {
    id: 7,
    date: '03/12/2024',
    voucher: 'S-920873850391',
    customer: 'Adam',
    biller: 'Joseph Amarho',
    remark: 'N/A',
    amount: 1382,
  },
];
