export interface PurchaseReturnsInterfaceData {
  id: number;
  date: any;
  reference: string | number;
  supplier: string;
  warehouse: string;
  amount: number;
  remark: string;
  action: any;
}
export const purchaseReturnsData: PurchaseReturnsInterfaceData[] = [
  {
    id: 1,
    date: '01/01/2024',
    reference: 'S-326564580710',
    supplier: 'William Prady',
    warehouse: 'Warehouse 8',
    amount: 5250,
    remark: 'Date Expired',
    action: 'Action',
  },
  {
    id: 2,
    date: '01/05/2024',
    reference: 'S-987654321098',
    supplier: 'Emily Jones',
    warehouse: 'Warehouse 3',
    amount: 3200,
    remark: 'N/A',
    action: 'Action',
  },
  {
    id: 3,
    date: '01/12/2024',
    reference: 'S-456789012345',
    supplier: 'John Smith',
    warehouse: 'Warehouse 5',
    amount: 7500,
    remark: 'N/A',
    action: 'Action',
  },
  {
    id: 4,
    date: '01/20/2024',
    reference: 'S-123456789012',
    supplier: 'Sarah Johnson',
    warehouse: 'Warehouse 2',
    amount: 4200,
    remark: 'Duplicate',
    action: 'Action',
  },
  {
    id: 5,
    date: '01/15/2024',
    reference: 'S-678901234567',
    supplier: 'Michael Brown',
    warehouse: 'Warehouse 4',
    amount: 6100,
    remark: 'Quality less',
    action: 'Action',
  },
  {
    id: 6,
    date: '01/28/2024',
    reference: 'S-345678901234',
    supplier: 'Jessica Miller',
    warehouse: 'Warehouse 1',
    amount: 4800,
    remark: 'N/A',
    action: 'Action',
  },
  {
    id: 7,
    date: '01/03/2024',
    reference: 'S-890123456789',
    supplier: 'David Wilson',
    warehouse: 'Warehouse 6',
    amount: 5500,
    remark: 'Not Good',
    action: 'Action',
  },
  {
    id: 8,
    date: '01/19/2024',
    reference: 'S-567890123456',
    supplier: 'Amanda Taylor',
    warehouse: 'Warehouse 9',
    amount: 6900,
    remark: 'N/A',
    action: 'Action',
  },
  {
    id: 9,
    date: '01/22/2024',
    reference: 'S-234567890123',
    supplier: 'Daniel Martinez',
    warehouse: 'Warehouse 7',
    amount: 3800,
    remark: 'Package Broken',
    action: 'Action',
  },
  {
    id: 10,
    date: '01/19/2024',
    reference: 'S-567890128256',
    supplier: 'Taylor Swift',
    warehouse: 'Warehouse 9',
    amount: 7200,
    remark: 'Date Expired',
    action: 'Action',
  },
];
