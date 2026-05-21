export interface DiscountReportInterfaceData {
  id: number;
  date: string;
  warehouse: string;
  product: string;
  invoiceNo: number;
  discount: number;
  amount: number;
}
export const discountReportData: DiscountReportInterfaceData[] = [
  {
    id: 1,
    date: '01 Jan 2024',
    warehouse: 'Warehouse 1',
    product: 'China Apple',
    invoiceNo: 58756689,
    discount: 2,
    amount: 582.0,
  },
  {
    id: 2,
    date: '02 Jan 2024',
    warehouse: 'Warehouse 2',
    product: 'Australian Orange',
    invoiceNo: 58756690,
    discount: 5,
    amount: 720.0,
  },
  {
    id: 3,
    date: '03 Jan 2024',
    warehouse: 'Warehouse 1',
    product: 'Acer',
    invoiceNo: 58756691,
    discount: 7,
    amount: 390.0,
  },
  {
    id: 4,
    date: '04 Jan 2024',
    warehouse: 'Warehouse 2',
    product: 'T-shirt',
    invoiceNo: 58756692,
    discount: 9,
    amount: 880.0,
  },
  {
    id: 5,
    date: '05 Jan 2024',
    warehouse: 'Warehouse 1',
    product: 'Dell Laptop',
    invoiceNo: 58756693,
    discount: 8,
    amount: 675.0,
  },
  {
    id: 6,
    date: '06 Jan 2024',
    warehouse: 'Warehouse 2',
    product: 'Mouse',
    invoiceNo: 58756694,
    discount: 6,
    amount: 480.0,
  },
  {
    id: 7,
    date: '07 Jan 2024',
    warehouse: 'Warehouse 1',
    product: 'HP Monitor',
    invoiceNo: 58756695,
    discount: 10,
    amount: 810.0,
  },
  {
    id: 8,
    date: '08 Jan 2024',
    warehouse: 'Warehouse 2',
    product: 'LED TV',
    invoiceNo: 58756696,
    discount: 20,
    amount: 1080.0,
  },
  {
    id: 9,
    date: '09 Jan 2024',
    warehouse: 'Warehouse 1',
    product: 'Thai Pineapple',
    invoiceNo: 58756697,
    discount: 11,
    amount: 240.0,
  },
  {
    id: 10,
    date: '10 Jan 2024',
    warehouse: 'Warehouse 2',
    product: 'Mexican Avocado',
    invoiceNo: 58756694,
    discount: 20,
    amount: 480.0,
  },
  {
    id: 11,
    date: '11 Jan 2024',
    warehouse: 'Warehouse 1',
    product: 'Italian Lemon',
    invoiceNo: 58756695,
    discount: 25,
    amount: 810.0,
  },
];
