export interface SaleInvoiceInterfaceData {
  id: number;
  date: string;
  name: string;
  phone: number | string;
  company: string;
  status: string;
  action: any;
}
export const saleInvoiceData: SaleInvoiceInterfaceData[] = [
  {
    id: 1,
    date: '10/02/2024',
    name: 'Joseph Tylor',
    phone: `+02585339202`,
    company: 'Uevs Technology',
    status: 'Partial',
    action: 'action',
  },
  {
    id: 2,
    date: '11/02/2024',
    name: 'Paul Freeman',
    phone: `+02585339203`,
    company: 'Amazon',
    status: 'Paid',
    action: 'action',
  },
  {
    id: 3,
    date: '12/02/2024',
    name: 'Matthew Smallwood',
    phone: `+02585339204`,
    company: 'Adidas',
    status: 'Paid',
    action: 'action',
  },
  {
    id: 4,
    date: '13/02/2024',
    name: 'Danyelle Lundy',
    phone: `+02585339243`,
    company: 'Suppervite',
    status: 'Due',
    action: 'action',
  },
  {
    id: 5,
    date: '14/02/2024',
    name: 'Glenn Weiner',
    phone: `+02585335203`,
    company: 'Trendy Wood',
    status: 'Due',
    action: 'action',
  },
  {
    id: 6,
    date: '15/02/2024',
    name: 'Alexander Crow',
    phone: `+02515339203`,
    company: 'Royal Gravity',
    status: 'Paid',
    action: 'action',
  },
  {
    id: 7,
    date: '16/02/2024',
    name: 'Rosemary Clark',
    phone: `+02575339203`,
    company: 'Finly Tokra',
    status: 'Paid',
    action: 'action',
  },
  {
    id: 8,
    date: '17/02/2024',
    name: 'Jennifer Carver',
    phone: `+02585339603`,
    company: 'Oppera Mentor',
    status: 'Partial',
    action: 'action',
  },
  {
    id: 9,
    date: '18/02/2024',
    name: 'Donald Boser',
    phone: `+02581339203`,
    company: 'Finly Tokra',
    status: 'Due',
    action: 'action',
  },
  {
    id: 10,
    date: '19/02/2024',
    name: 'Maria Cavallo',
    phone: `+02185339203`,
    company: 'Codexpeed',
    status: 'Paid',
    action: 'action',
  },
];
