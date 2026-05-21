export interface CustomerInterfaceData {
    id: any;
    name: string;
    phone: number | string;
    email: string;
    group: string;
    rewardPoints: string | number;
    address: string;
    action: any;
}
export const customerData: CustomerInterfaceData[] = [
    {
        id: 1,
        name: 'Joseph Tylor',
        phone: `+02585339202`,
        email: 'Joseph@example.com',
        group: 'General',
        rewardPoints: 256,
        address: '2851 Green Avenue, Oakland, CA 94612',
        action: 'action',
    },
    {
        id: 2,
        name: 'Paul Freeman',
        phone: `+02585339203`,
        email: 'Emily@example.com',
        group: 'Distributor',
        rewardPoints: 420,
        address: '123 Main Street, Anytown, NY 12345',
        action: 'action',
    },
    {
        id: 3,
        name: 'Matthew Smallwood',
        phone: `+02585339204`,
        email: 'Michael@example.com',
        group: 'Reseller',
        rewardPoints: 'N/A',
        address: '456 Elm Street, Springfield, IL 67890',
        action: 'action',
    },
    {
        id: 4,
        name: 'Danyelle Lundy',
        phone: `+02585339243`,
        email: 'Sophia@example.com',
        group: 'Distributor',
        rewardPoints: 256,
        address: '789 Oak Street, Pleasantville, TX 54321',
        action: 'action',
    },
    {
        id: 5,
        name: 'Glenn Weiner',
        phone: `+02585335203`,
        email: 'Alexander@example.com',
        group: 'Distributor',
        rewardPoints: 'N/A',
        address: '987 Pine Street, Lakeside, FL 98765',
        action: 'action',
    },
    {
        id: 6,
        name: 'Alexander Crow',
        phone: `+02515339203`,
        email: 'Emma@example.com',
        group: 'Reseller',
        rewardPoints: 652,
        address: '654 Maple Street, Riverside, WA 23456',
        action: 'action',
    },
    {
        id: 7,
        name: 'Rosemary Clark',
        phone: `+02575339203`,
        email: 'Daniel@example.com',
        group: 'Reseller',
        rewardPoints: 420,
        address: '321 Cedar Street, Mountainview, CA 65432',
        action: 'action',
    },
    {
        id: 8,
        name: 'Jennifer Carver',
        phone: `+02585339603`,
        email: 'Olivia@example.com',
        group: 'General',
        rewardPoints: 1056,
        address: '741 Birch Street, Oceanview, OR 87654',
        action: 'action',
    },
    {
        id: 9,
        name: 'Donald Boser',
        phone: `+02581339203`,
        email: 'William@example.com',
        group: 'General',
        rewardPoints: 'N/A',
        address: '852 Walnut Street, Hillside, NV 34567',
        action: 'action',
    },
    {
        id: 10,
        name: 'Maria Cavallo',
        phone: `+02185339203`,
        email: 'Ava@example.com',
        group: 'General',
        rewardPoints: 'N/A',
        address: '369 Cherry Street, Sunnyside, AZ 01234',
        action: 'action',
    },
];
