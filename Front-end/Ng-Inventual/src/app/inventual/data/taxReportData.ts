export interface TaxReportInterfaceData {
    id: number;
    date: string;
    warehouse: string;
    product: string;
    invoiceNo: number;
    tax: number;
    amount: number;
  }
  export const taxReportData: TaxReportInterfaceData[] = [
    {
        id: 1,
        date: '01 Jan 2024',
        warehouse: 'Warehouse 1',
        product: 'China Apple',
        invoiceNo: 58756689,
        tax: 2,
        amount: 582.00,
    },
    {
        id: 2,
        date: '02 Jan 2024',
        warehouse: 'Warehouse 2',
        product: 'Australian Orange',
        invoiceNo: 58756690,
        tax: 5,
        amount: 720.00,
    },
    {
        id: 3,
        date: '03 Jan 2024',
        warehouse: 'Warehouse 1',
        product: 'Acer',
        invoiceNo: 58756691,
        tax: 7,
        amount: 390.00,
    },
    {
        id: 4,
        date: '04 Jan 2024',
        warehouse: 'Warehouse 2',
        product: 'T-shirt',
        invoiceNo: 58756692,
        tax: 9,
        amount: 880.00,
    },
    {
        id: 5,
        date: '05 Jan 2024',
        warehouse: 'Warehouse 1',
        product: 'Dell Laptop',
        invoiceNo: 58756693,
        tax: 8,
        amount: 675.00,
    },
    {
        id: 6,
        date: '06 Jan 2024',
        warehouse: 'Warehouse 2',
        product: 'Mouse',
        invoiceNo: 58756694,
        tax: 6,
        amount: 480.00,
    },
    {
        id: 7,
        date: '07 Jan 2024',
        warehouse: 'Warehouse 1',
        product: 'HP Monitor',
        invoiceNo: 58756695,
        tax: 10,
        amount: 810.00,
    },
    {
        id: 8,
        date: '08 Jan 2024',
        warehouse: 'Warehouse 2',
        product: 'LED TV',
        invoiceNo: 58756696,
        tax: 20,
        amount: 1080.00,
    },
    {
        id: 9,
        date: '09 Jan 2024',
        warehouse: 'Warehouse 1',
        product: 'Thai Pineapple',
        invoiceNo: 58756697,
        tax: 11,
        amount: 240.00,
    },
    {
        id: 10,
        date: '10 Jan 2024',
        warehouse: 'Warehouse 2',
        product: 'Mexican Avocado',
        invoiceNo: 58756694,
        tax: 20,
        amount: 480.00,
    },
    {
        id: 11,
        date: '11 Jan 2024',
        warehouse: 'Warehouse 1',
        product: 'Italian Lemon',
        invoiceNo: 58756695,
        tax: 25,
        amount: 810.00,
    },
  ];
  