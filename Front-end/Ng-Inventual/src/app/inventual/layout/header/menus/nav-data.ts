import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: '/dashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
    permission: 'Dashboard'
  },
  {
    routeLink: 'product',
    icon: 'fal fa-box-open',
    label: 'Products',
    items: [
      {
        routeLink: '/product/addproduct',
        label: 'Add Product',
        permission: 'Productos'
      },
      {
        routeLink: '/product/productlist',
        label: 'Product List',
        permission: 'Productos'
      },
      {
        routeLink: '/product/productcategory',
        label: 'Category',
        permission: 'Categorias'
      },
      {
        routeLink: '/product/addbrand',
        label: 'Brand',
        permission: 'Marcas'
      },
      {
        routeLink: '/product/unit',
        label: 'Unit/Value',
        permission: 'Unidades'
      },
      {
        routeLink: '/product/generatebarcode',
        label: 'Generate Barcode',
        permission: 'Productos'
      },
      {
        routeLink: '/product/addadjustment',
        label: 'Add Adjustment',
        permission: 'Ajustes'
      },
      {
        routeLink: '/product/adjustment',
        label: 'Adjustments',
        permission: 'Ajustes'
      },
    ],
  },
  {
    routeLink: 'trading',
    icon: 'fal fa-sack-dollar',
    label: 'Trading',
    items: [
      {
        routeLink: 'trading/sales',
        label: 'Sales',
        items: [
          {
            routeLink: '/trading/sales/newsale',
            label: 'New Sales',
            permission: 'Ventas'
          },
          {
            routeLink: '/trading/sales/possale',
            label: 'POS Sales',
            permission: 'Ventas'
          },
          {
            routeLink: '/trading/sales/managesale',
            label: 'Sales List',
            permission: 'Ventas'
          },
          {
            routeLink: '/trading/sales/salereturns',
            label: 'Sales Returns',
            permission: 'Ventas'
          },
        ],
      },
      {
        routeLink: 'trading/purchase',
        label: 'Purchase',
        items: [
          {
            routeLink: '/trading/purchase/addpurchase',
            label: 'Add Purchase',
            permission: 'Compras'
          },
          {
            routeLink: '/trading/purchase/managepurchase',
            label: 'Manage Purchase',
            permission: 'Compras'
          },
          {
            routeLink: '/trading/purchase/purchasereturns',
            label: 'Purchase Returns',
            permission: 'Compras'
          },
        ],
      },
      {
        routeLink: 'trading/invoice',
        label: 'Invoice/Billing',
        items: [
          {
            routeLink: '/trading/invoice/saleinvoice',
            label: 'Sale Invoice',
            permission: 'Facturacion'
          },
          {
            routeLink: '/trading/invoice/salesinvoice',
            label: 'Sale List Invoice',
            permission: 'Facturacion'
          },
          {
            routeLink: '/trading/invoice/purchaseinvoice',
            label: 'Purchase Invoice',
            permission: 'Facturacion'
          },
          {
            routeLink: '/trading/invoice/purchaselistinvoice',
            label: 'Purchase List Invoice',
            permission: 'Facturacion'
          },
          {
            routeLink: '/trading/invoice/expenseinvoice',
            label: 'Expense Invoice',
            permission: 'Facturacion'
          },
          {
            routeLink: '/trading/invoice/expenselistinvoice',
            label: 'Expense List Invoice',
            permission: 'Facturacion'
          },
        ],
      },
    ],
  },
  {
    routeLink: 'expesne',
    icon: 'fal fa-ballot',
    label: 'Expesne',
    items: [
      {
        routeLink: '/expesne/addexpense',
        label: 'Add Expense',
        permission: 'Gastos'
      },
      {
        routeLink: '/expesne/expenselist',
        label: 'Gastos',
      },
      {
        routeLink: '/expesne/expensecategory',
        label: 'Expense Category',
        permission: 'Gastos'
      },
      {
        routeLink: '/expesne/createpayment',
        label: 'Payment Expense',
        permission: 'Gastos'
      },
    ],
  },
  {
    routeLink: 'people',
    icon: 'fal fa-users',
    label: 'People',
    items: [
      {
        routeLink: '/people/addcustomer',
        label: 'Add Customer',
        permission: 'Clientes'
      },
      {
        routeLink: '/people/customerlist',
        label: 'Customer List',
        permission: 'Clientes'
      },
      {
        routeLink: '/people/addsupplier',
        label: 'Add Supplier',
        permission: 'Proveedores'
      },
      {
        routeLink: '/people/supplierlist',
        label: 'Supplier List',
        permission: 'Proveedores'
      },
      {
        routeLink: '/people/addbiller',
        label: 'Add Biller',
        permission: 'Facturadores'
      },
      {
        routeLink: '/people/billerlist',
        label: 'Biller List',
        permission: 'Facturadores'
      },
    ],
  },
  {
    routeLink: 'client',
    icon: 'fal fa-user',
    label: 'User Management',
    items: [
      {
        routeLink: '/client/adduser',
        label: 'Add User',
        permission: 'Usuarios'
      },
      {
        routeLink: '/client/userlist',
        label: 'User List',
        permission: 'Usuarios'
      },
      {
        routeLink: '/client/createrole',
        label: 'Create Role',
        permission: 'Roles'
      },
      {
        routeLink: '/client/rolelist',
        icon: 'fal fa-user-shield',
        label: 'Role List',
        permission: 'Roles'
      }
    ],
  },
  {
    routeLink: 'transfer',
    icon: 'fal fa-tags',
    label: 'Transfer',
    items: [
      {
        routeLink: '/transfer/addtransfer',
        label: 'Add Transfer',
        permission: 'Transferencias'
      },
      {
        routeLink: '/transfer/transferlist',
        label: 'Transfer List',
        permission: 'Transferencias'
      },
    ],
  },
  {
    routeLink: 'report',
    icon: 'fal fa-inventory',
    label: 'Reports',
    items: [
      {
        routeLink: '/report/salereport',
        label: 'Sales Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/purchasereport',
        label: 'Purchase Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/paymentreport',
        label: 'Payment Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/productreport',
        label: 'Product Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/stockreport',
        label: 'Stock Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/expensereport',
        label: 'Expense Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/userreport',
        label: 'User Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/customerreport',
        label: 'Customer Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/warehousereport',
        label: 'Warehouse Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/supplierreport',
        label: 'Supplier Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/discountreport',
        label: 'Discount Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/taxreport',
        label: 'Tax Report',
        permission: 'Reportes'
      },
      {
        routeLink: '/report/shippingchargereport',
        label: 'Shipping Charge',
        permission: 'Reportes'
      },
    ],
  },
  {
    routeLink: '/warehouselist',
    icon: 'fal fa-building',
    label: 'Warehouse',
    permission: 'Bodegas'
  },
  {
    routeLink: '/auditoria',
    icon: 'fal fa-clipboard-list',
    label: 'Audit Logs',
    permission: 'Auditoria'
  },
  {
    routeLink: 'settings',
    icon: 'fal fa-cog',
    label: 'Settings',
    items: [
      {
        routeLink: '/settings/email',
        label: 'Configurar correo',
        permission: 'Configurar Correo'
      }
    ]
  },
];
