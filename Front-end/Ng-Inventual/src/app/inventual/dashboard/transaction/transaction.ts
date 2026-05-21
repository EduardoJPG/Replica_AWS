import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dashboardSaleData, DashboardSaleInterfaceData } from '../../data/dashboardSaleData';
import { dashboardPurchaseData, DashboardPurchaseInterfaceData } from '../../data/dashboardPurchaseData';
import { dashboardPaymentData, DashboardPaymentInterfaceData } from '../../data/dashboardPaymentData';
import { dashboardReturnsData, DashboardReturnsInterfaceData } from '../../data/dashboardReturnsData';
import { dashboardExpenseData, DashboardExpenseInterfaceData } from '../../data/dashboardExpenseData';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  imports: [MatTab, MatTabGroup, MatTableModule, CommonModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Transaction {
  displayedColumns: string[] = [
    'date',
    'reference',
    'customer',
    'payment',
    'status',
    'amount',
  ];
  displayedColumnsA: string[] = [
    'date',
    'reference',
    'supplier',
    'payment',
    'status',
    'amount',
  ];
  displayedColumnsB: string[] = [
    'date',
    'reference',
    'payment',
    'status',
    'amount',
  ];
  displayedColumnsC: string[] = [
    'date',
    'voucher',
    'customer',
    'biller',
    'remark',
    'amount',
  ];
  displayedColumnsD: string[] = [
    'date',
    'voucher',
    'name',
    'category',
    'status',
    'amount',
  ];

  dataSource: MatTableDataSource<DashboardSaleInterfaceData>;
  dataSourceA: MatTableDataSource<DashboardPurchaseInterfaceData>;
  dataSourceB: MatTableDataSource<DashboardPaymentInterfaceData>;
  dataSourceC: MatTableDataSource<DashboardReturnsInterfaceData>;
  dataSourceD: MatTableDataSource<DashboardExpenseInterfaceData>;

  constructor() {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(dashboardSaleData);
    this.dataSourceA = new MatTableDataSource(dashboardPurchaseData);
    this.dataSourceB = new MatTableDataSource(dashboardPaymentData);
    this.dataSourceC = new MatTableDataSource(dashboardReturnsData);
    this.dataSourceD = new MatTableDataSource(dashboardExpenseData);
  }
}
