import { Routes } from '@angular/router';
import { RoleList } from './inventual/user/role-list/role-list';
import { Dashboard } from './inventual/dashboard/dashboard/dashboard';
import { Login } from './inventual/auth/login/login';
import { Register } from './inventual/auth/register/register';
import { Forgotpassword } from './inventual/auth/forgotpassword/forgotpassword';
import { Adduser } from './inventual/user/adduser/adduser';
import { Createrole } from './inventual/user/createrole/createrole';
import { Userlist } from './inventual/user/userlist/userlist';
import { AddProduct } from './inventual/products/add-product/add-product';
import { ProductList } from './inventual/products/product-list/product-list';
import { Brand } from './inventual/products/brand/brand';
import { Adjustment } from './inventual/products/adjustment/adjustment';
import { AddAdjustment } from './inventual/products/add-adjustment/add-adjustment';
import { Unit } from './inventual/products/unit/unit';
import { GenerateBarcode } from './inventual/products/generate-barcode/generate-barcode';
import { Category } from './inventual/products/category/category';
import { PosSale } from './inventual/trading/sale/pos-sale/pos-sale';
import { NewSale } from './inventual/trading/sale/new-sale/new-sale';
import { ManageSale } from './inventual/trading/sale/manage-sale/manage-sale';
import { SaleReturns } from './inventual/trading/sale/sale-returns/sale-returns';
import { AddPurchase } from './inventual/trading/purchase/add-purchase/add-purchase';
import { ManagePurchase } from './inventual/trading/purchase/manage-purchase/manage-purchase';
import { PurchaseReturns } from './inventual/trading/purchase/purchase-returns/purchase-returns';
import { SaleInvoice } from './inventual/trading/invoice/sale-invoice/sale-invoice';
import { ExpenseInvoice } from './inventual/trading/invoice/expense-invoice/expense-invoice';
import { SalesInvoice } from './inventual/trading/invoice/sales-invoice/sales-invoice';
import { ExpenseListInvoice } from './inventual/trading/invoice/expense-list-invoice/expense-list-invoice';
import { PurchaseListInvoice } from './inventual/trading/invoice/purchase-list-invoice/purchase-list-invoice';
import { PurchaseInvoice } from './inventual/trading/invoice/purchase-invoice/purchase-invoice';
import { AddExpense } from './inventual/expense/add-expense/add-expense';
import { PaymentExpense } from './inventual/expense/payment-expense/payment-expense';
import { ExpenseCategory } from './inventual/expense/expense-category/expense-category';
import { ExpenseList } from './inventual/expense/expense-list/expense-list';
import { AddTransfer } from './inventual/transfer/add-transfer/add-transfer';
import { TransferList } from './inventual/transfer/transfer-list/transfer-list';
import { WarehouseList } from './inventual/warehouse/warehouse-list/warehouse-list';
import { AddSupplier } from './inventual/people/add-supplier/add-supplier';
import { AddCustomer } from './inventual/people/add-customer/add-customer';
import { AddBiller } from './inventual/people/add-biller/add-biller';
import { SupplierList } from './inventual/people/supplier-list/supplier-list';
import { CustomerList } from './inventual/people/customer-list/customer-list';
import { BillerList } from './inventual/people/biller-list/biller-list';
import { RolePermission } from './inventual/settings/role-permission/role-permission';
import { EmailSettings } from './inventual/settings/email-settings/email-settings';
import { ShippingReport } from './inventual/report/shipping-report/shipping-report';
import { SupplierReport } from './inventual/report/supplier-report/supplier-report';
import { WarehouseReport } from './inventual/report/warehouse-report/warehouse-report';
import { CustomerReport } from './inventual/report/customer-report/customer-report';
import { UserReport } from './inventual/report/user-report/user-report';
import { TaxReport } from './inventual/report/tax-report/tax-report';
import { DiscountReport } from './inventual/report/discount-report/discount-report';
import { ExpenseReport } from './inventual/report/expense-report/expense-report';
import { PurchaseReport } from './inventual/report/purchase-report/purchase-report';
import { SaleReport } from './inventual/report/sale-report/sale-report';
import { PaymentReport } from './inventual/report/payment-report/payment-report';
import { StockReport } from './inventual/report/stock-report/stock-report';
import { ProductReport } from './inventual/report/product-report/product-report';
import { NotFound } from './inventual/not-found/not-found';
import { Profile } from './inventual/common/profile/profile';
import { MessageInbox } from './inventual/common/message-inbox/message-inbox';
import { NewMessage } from './inventual/common/new-message/new-message';
import { AuditoriaList } from './inventual/auditoria/auditoria-list/auditoria-list';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission-guard';


export const routes: Routes = [
  { path: '', component: Login, pathMatch: 'full' },
  {
    path: 'client/rolelist',
    component: RoleList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Roles', action: 'puede_ver' }
  },
  {
    path: 'register',
    component: Register,
    canActivate: [authGuard]
  },
  {
    path: 'forgotpassword',
    component: Forgotpassword,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Dashboard', action: 'puede_ver' }
  },
  {
    path: 'product/addproduct',
    component: AddProduct,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Productos', action: 'puede_crear' }
  },
  {
    path: 'product/productlist',
    component: ProductList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Productos', action: 'puede_ver' }
  },
  {
    path: 'product/addbrand',
    component: Brand,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Marcas', action: 'puede_crear' }
  },
  {
    path: 'product/addadjustment',
    component: AddAdjustment,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ajustes', action: 'puede_crear' }
  },
  {
    path: 'product/adjustment',
    component: Adjustment,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ajustes', action: 'puede_ver' }
  },
  {
    path: 'product/unit',
    component: Unit,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Unidades', action: 'puede_ver' }
  },
  {
    path: 'product/productcategory',
    component: Category,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Categorías', action: 'puede_ver' }
  },
  {
    path: 'product/generatebarcode',
    component: GenerateBarcode,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Productos', action: 'puede_ver' }
  },
  {
    path: 'client/adduser',
    component: Adduser,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Usuarios', action: 'puede_crear' }
  },
  {
    path: 'client/createrole',
    component: Createrole,
    canActivate: [authGuard]
  },
  {
    path: 'client/createrole/:id',
    component: Createrole,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Roles', action: 'puede_crear' }
  },
  {
    path: 'client/userlist',
    component: Userlist,
    canActivate: [authGuard],
  },
  {
    path: 'trading/sales/possale',
    component: PosSale,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ventas', action: 'puede_crear' }
  },
  {
    path: 'trading/sales/newsale',
    component: NewSale,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ventas', action: 'puede_crear' }
  },
  {
    path: 'trading/sales/managesale',
    component: ManageSale,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ventas', action: 'puede_ver' }
  },
  {
    path: 'trading/sales/salereturns',
    component: SaleReturns,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ventas', action: 'puede_crear' }
  },
  {
    path: 'trading/purchase/addpurchase',
    component: AddPurchase,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_crear' }
  },
  {
    path: 'trading/purchase/managepurchase',
    component: ManagePurchase,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_ver' }
  },
  {
    path: 'trading/purchase/purchasereturns',
    component: PurchaseReturns,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_editar' }
  },
  {
  path: 'trading/invoice/saleinvoice',
  component: SaleInvoice,
  canActivate: [authGuard, permissionGuard],
  data: { permission: 'Ventas', action: 'puede_ver' }
  },
  {
    path: 'trading/invoice/expenseinvoice',
    component: ExpenseInvoice,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_ver' }
  },
  {
    path: 'trading/invoice/salesinvoice',
    component: SalesInvoice,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Ventas', action: 'puede_ver' }
  },
  {
    path: 'trading/invoice/expenselistinvoice',
    component: ExpenseListInvoice,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_ver' }
  },
  {
    path: 'trading/invoice/purchaselistinvoice',
    component: PurchaseListInvoice,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_ver' }
  },
  {
    path: 'trading/invoice/purchaseinvoice',
    component: PurchaseInvoice,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Compras', action: 'puede_ver' }
  },
  {
    path: 'expesne/addexpense',
    component: AddExpense,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Gastos', action: 'puede_crear' }
  },
  {
    path: 'expesne/createpayment',
    component: PaymentExpense,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Gastos', action: 'puede_crear' }
  },
  {
    path: 'expesne/expensecategory',
    component: ExpenseCategory,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Gastos', action: 'puede_editar' }
  },
  {
    path: 'expesne/expenselist',
    component: ExpenseList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Gastos', action: 'puede_ver' }
  },
  {
    path: 'people/addsupplier',
    component: AddSupplier,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Proveedores', action: 'puede_crear' }
  },
  {
    path: 'people/editsupplier/:id',
    component: AddSupplier,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Proveedores', action: 'puede_editar' }
  },
  {
    path: 'people/supplierlist',
    component: SupplierList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Proveedores', action: 'puede_ver' }
  },
  {
    path: 'people/addcustomer',
    component: AddCustomer,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Clientes', action: 'puede_crear' }
  },
  {
    path: 'people/customerlist',
    component: CustomerList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Clientes', action: 'puede_ver' }
  },
  {
    path: 'people/addbiller',
    component: AddBiller,
    canActivate: [authGuard]
  },
  {
    path: 'people/billerlist',
    component: BillerList,
    canActivate: [authGuard]
  },
  {
  path: 'people/editbiller/:id',
  component: AddBiller,
  canActivate: [authGuard]
},
  {
    path: 'transfer/addtransfer',
    component: AddTransfer,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Transferencias', action: 'puede_crear' }
  },
  {
    path: 'transfer/transferlist',
    component: TransferList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Transferencias', action: 'puede_ver' }
  },
  {
    path: 'warehouselist',
    component: WarehouseList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Bodegas', action: 'puede_ver' }
  },
  {
    path: 'rolepermission',
    component: RolePermission,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Roles', action: 'puede_editar' }
  },
  {
    path: 'settings/email',
    component: EmailSettings,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Configurar Correo', action: 'puede_ver' }
  },
  {
    path: 'auditoria',
    component: AuditoriaList,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Auditoria', action: 'puede_ver' }
  },
  {
    path: 'report/productreport',
    component: ProductReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/stockreport',
    component: StockReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/paymentreport',
    component: PaymentReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/salereport',
    component: SaleReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/purchasereport',
    component: PurchaseReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/expensereport',
    component: ExpenseReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/discountreport',
    component: DiscountReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/taxreport',
    component: TaxReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/userreport',
    component: UserReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/customerreport',
    component: CustomerReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/warehousereport',
    component: WarehouseReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/supplierreport',
    component: SupplierReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'report/shippingchargereport',
    component: ShippingReport,
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'Reportes', action: 'puede_ver' }
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'message',
    component: MessageInbox,
    canActivate: [authGuard]
  },
  {
    path: 'newmessage',
    component: NewMessage,
    canActivate: [authGuard]
  },
  // ✅ Wildcard route must be last
  { path: '**', component: NotFound },
];
