export interface RoleInterfaceData {
  id: number;
  role: string;
  description: string;
  action: any;
}
export const roleData: RoleInterfaceData[] = [
  {
    id: 1,
    role: 'Owner',
    description: 'The owner can control all the access',
    action: 'kg',
  },
  {
    id: 2,
    role: 'Super Admin',
    description: 'The Supper admin can control all the access',
    action: 'cm',
  },
  {
    id: 3,
    role: 'Admin',
    description: 'The admin can control all the access',
    action: 'qty',
  },
  {
    id: 4,
    role: 'Manager',
    description: 'Manager has specific access',
    action: 'g',
  },
  {
    id: 5,
    role: 'Supervisor',
    description: 'Supervisor has little access',
    action: 'p',
  },
  {
    id: 6,
    role: 'Biller',
    description: 'Biller has limited access',
    action: 'mm',
  },
  {
    id: 7,
    role: 'BillerA',
    description: 'Biller has limited access',
    action: 'mm',
  },
  {
    id: 8,
    role: 'BillerB',
    description: 'Biller has limited access',
    action: 'mm',
  },
  {
    id: 9,
    role: 'Staff',
    description: 'Staff has specific access',
    action: 'mm',
  },
  {
    id: 10,
    role: 'BillerC',
    description: 'Biller has limited access',
    action: 'mm',
  },
];
