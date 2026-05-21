export interface AdjustmentInterfaceData {
  id: any;
  name: string;
  code: number;
  warehouse: string;
  remarks: string;
  type: string;
  action: any;
}
export const adjustmentData: AdjustmentInterfaceData[] = [
  {
    id: 1,
    name: 'Green lemon',
    code: 875542233,
    warehouse: 'Warehouse 1',
    remarks: 'N/A',
    type: 'Addition',
    action: 'action',
  },
  {
    id: 2,
    name: 'Dell laptop',
    code: 878718975,
    warehouse: 'Warehouse 2',
    remarks: 'N/A',
    type: 'Subtraction',
    action: 'action',
  },
  {
    id: 3,
    name: 'Cannon Printer',
    code: 985645966,
    warehouse: 'Warehouse 3',
    remarks: 'N/A',
    type: 'Subtraction',
    action: 'action',
  },
  {
    id: 4,
    name: 'A4tech Mouse',
    code: 201566589,
    warehouse: 'Warehouse 4',
    remarks: 'N/A',
    type: 'Addition',
    action: 'action',
  },
  {
    id: 5,
    name: 'Panda Sunglass',
    code: 154266989,
    warehouse: 'Warehouse 5',
    remarks: 'N/A',
    type: 'Addition',
    action: 'action',
  },
  {
    id: 6,
    name: 'Printer',
    code: 154266689,
    warehouse: 'Warehouse 4',
    remarks: 'N/A',
    type: 'Subtraction',
    action: 'action',
  },
];
