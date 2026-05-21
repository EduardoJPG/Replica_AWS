import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddPayment } from '../../popup/add-payment/add-payment';
import { ViewPayment } from '../../popup/view-payment/view-payment';
import {
  purchaseData,
  PurchaseInterfaceData,
} from '../../../data/purchaseData';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Menus } from '../../../layout/header/menus/menus';
import { Header } from '../../../layout/header/header/header';
import { Footer } from '../../../layout/footer/footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterIcon } from '../../../icons/filter-icon/filter-icon';
import { PdfIcon } from '../../../icons/pdf-icon/pdf-icon';
import { CsvIcon } from '../../../icons/csv-icon/csv-icon';
import { PrinterIcon } from '../../../icons/printer-icon/printer-icon';

@Component({
  selector: 'app-manage-purchase',
  imports: [
    Menus,
    Header,
    Footer,
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    FilterIcon,
    PdfIcon,
    CsvIcon,
    PrinterIcon,
  ],
  templateUrl: './manage-purchase.html',
  styleUrl: './manage-purchase.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ManagePurchase {
  displayedColumns: string[] = [
    'select',
    'date',
    'reference',
    'supplier',
    'warehouse',
    'status',
    'payment',
    'total',
    'paid',
    'due',
    'action',
  ];
  dataSource: MatTableDataSource<PurchaseInterfaceData>;
  selection = new SelectionModel<PurchaseInterfaceData>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public dialog: MatDialog) {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(purchaseData);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PurchaseInterfaceData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }
  //checkbox end

  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    } else {
      this.menuSidebarActive = false;
    }
  }
  //sidebar menu activation end

  addPayment() {
    this.dialog.open(AddPayment);
  }

  viewPayment() {
    this.dialog.open(ViewPayment);
  }
}
