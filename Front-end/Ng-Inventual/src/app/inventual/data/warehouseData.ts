export interface WarehouseInterfaceData {
  id: number;
  warehouse: string;
  phone: number | string;
  email: string;
  address: string;
  action: any;
}
export const warehouseData: WarehouseInterfaceData[] = [
    {
        id: 1,
        warehouse: 'Warehouse 1',
        phone: `+02585339202`,
        email: 'Joseph@example.com',
        address: '2851 Green Avenue, Oakland, CA 94612',
        action: 'action',
    },
    {
        id: 2,
        warehouse: 'Warehouse 2',
        phone: '+02585339203',
        email: 'Emily@example.com',
        address: '123 Main Street, Anytown, NY 12345',
        action: 'action',
    },
    {
        id: 3,
        warehouse: 'Warehouse 3',
        phone: '+02585339204',
        email: 'Michael@example.com',
        address: '456 Elm Street, Springfield, IL 67890',
        action: 'action',
    },
    {
        id: 4,
        warehouse: 'Warehouse 4',
        phone: '+02585339205',
        email: 'Sophia@example.com',
        address: '789 Oak Street, Pleasantville, TX 54321',
        action: 'action',
    },
    {
        id: 5,
        warehouse: 'Warehouse 5',
        phone: '+02585339206',
        email: 'Alexander@example.com',
        address: '987 Pine Street, Lakeside, FL 98765',
        action: 'action',
    },
    {
        id: 6,
        warehouse: 'Warehouse 6',
        phone: '+02585339207',
        email: 'Emma@example.com',
        address: '654 Maple Street, Riverside, WA 23456',
        action: 'action',
    },
    {
        id: 7,
        warehouse: 'Warehouse 7',
        phone: '+02585339208',
        email: 'Daniel@example.com',
        address: '321 Cedar Street, Mountainview, CA 65432',
        action: 'action',
    },
    {
        id: 8,
        warehouse: 'Warehouse 8',
        phone: '+02585339209',
        email: 'Olivia@example.com',
        address: '741 Birch Street, Oceanview, OR 87654',
        action: 'action',
    },
    {
        id: 9,
        warehouse: 'Warehouse 9',
        phone: '+02585339210',
        email: 'William@example.com',
        address: '852 Walnut Street, Hillside, NV 34567',
        action: 'action',
    },
    {
        id: 10,
        warehouse: 'Warehouse 10',
        phone: '+02585339211',
        email: 'Ava@example.com',
        address: '369 Cherry Street, Sunnyside, AZ 01234',
        action: 'action',
    },
    {
        id: 11,
        warehouse: 'Warehouse 11',
        phone: '+02585789211',
        email: 'bluyan@example.com',
        address: '369 Cherry Street, Sunnyside, AZ 01224',
        action: 'action',
    },
];
