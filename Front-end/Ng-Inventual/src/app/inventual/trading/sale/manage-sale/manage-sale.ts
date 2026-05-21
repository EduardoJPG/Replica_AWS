import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FilterIcon } from '../../../icons/filter-icon/filter-icon';
import { PdfIcon } from '../../../icons/pdf-icon/pdf-icon';
import { CsvIcon } from '../../../icons/csv-icon/csv-icon';
import { PrinterIcon } from '../../../icons/printer-icon/printer-icon';
import { SaleInterfaceData } from '../../../data/saleData';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ViewPayment } from '../../popup/view-payment/view-payment';
import { Invoice } from '../../popup/invoice/invoice';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialog } from '../../../../shared/confirm-dialog/confirm-dialog';
import { ViewSaleDialog } from './view-sale-dialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-manage-sale',
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
    MatSnackBarModule,
  ],
  templateUrl: './manage-sale.html',
  styleUrl: './manage-sale.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ManageSale implements OnInit {
  displayedColumns: string[] = [
    'select',
    'date',
    'reference',
    'customer',
    'warehouse',
    'status',
    'biller',
    'payment',
    'total',
    'paid',
    'due',
    'action',
  ];
  dataSource: MatTableDataSource<SaleInterfaceData>;
  selection = new SelectionModel<SaleInterfaceData>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<SaleInterfaceData>([]);
  }

  ngOnInit() {
    this.loadSales();

    const payment = this.route.snapshot.queryParamMap.get('payment');
    if (payment === 'success') {
      this.showMessage('Pago enviado a Stripe. La venta quedara completada cuando Stripe confirme el webhook.');
    } else if (payment === 'cancel') {
      this.showMessage('Pago cancelado');
    }
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
  checkboxLabel(row?: SaleInterfaceData): string {
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

  viewSale(row: SaleInterfaceData) {
    this.http.get<any>(`${environment.apiUrl}/api/ventas/${row.id}`).subscribe({
      next: (sale) => {
        this.dialog.open(ViewSaleDialog, {
          width: '920px',
          data: sale,
        });
      },
      error: () => this.showMessage('No se pudo cargar el detalle de la venta'),
    });
  }

  editSale(row: SaleInterfaceData) {
    if (String(row.payment).toLowerCase() === 'paid') {
      this.showMessage('Las ventas pagadas no se editan desde la lista para evitar descuadres de inventario');
      return;
    }

    this.router.navigate(['/trading/sales/newsale'], {
      queryParams: { edit: row.id },
    });
  }

  addPayment(row: SaleInterfaceData) {
    if (String(row.payment).toLowerCase() === 'paid') {
      this.showMessage('Esta venta ya esta pagada');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: { message: `Deseas registrar el pago de la venta ${row.reference}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.http.post<any>(`${environment.apiUrl}/api/ventas/${row.id}/pago`, {}).subscribe({
        next: (res) => {
          this.showMessage(res?.message || 'Pago registrado correctamente');
          this.loadSales();
        },
        error: (err) => this.showMessage(err?.error?.message || 'No se pudo registrar el pago'),
      });
    });
  }

  viewPayment(row: SaleInterfaceData) {
    this.dialog.open(ViewPayment, {
      width: '700px',
      data: row,
    });
  }

  invoice(row: SaleInterfaceData) {
    this.http.get<any>(`${environment.apiUrl}/api/ventas/${row.id}`).subscribe({
      next: (sale) => {
        this.dialog.open(Invoice, {
          width: '980px',
          data: sale,
        });
      },
      error: () => this.showMessage('No se pudo generar la factura'),
    });
  }

  deleteSale(row: SaleInterfaceData) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: { message: `Seguro que deseas inactivar la venta ${row.reference}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.http.delete<any>(`${environment.apiUrl}/api/ventas/${row.id}`).subscribe({
        next: (res) => {
          this.showMessage(res?.message || 'Venta inactivada correctamente');
          this.loadSales();
        },
        error: (err) => this.showMessage(err?.error?.message || 'No se pudo inactivar la venta'),
      });
    });
  }

  private loadSales() {
    this.http.get<any[]>(`${environment.apiUrl}/api/ventas`).subscribe({
      next: (data) => {
        this.dataSource.data = data.map((sale) => ({
          id: sale.idVenta ?? sale.id,
          date: sale.date ?? sale.fecha,
          reference: sale.reference ?? sale.referencia,
          customer: sale.customer ?? sale.cliente ?? 'Cliente general',
          warehouse: sale.warehouse ?? sale.bodega ?? 'Sin bodega',
          status: this.mapSaleStatus(sale.status ?? sale.estadoVenta),
          biller: sale.biller ?? sale.facturador ?? 'Sin facturador',
          payment: this.mapPaymentStatus(sale.payment ?? sale.estadoPago),
          total: Number(sale.total) || 0,
          paid: Number(sale.paid) || 0,
          due: Number(sale.due) || 0,
          action: sale.action,
        }));
      },
      error: () => this.showMessage('No se pudieron cargar las ventas'),
    });
  }

  private mapSaleStatus(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('complet')) {
      return 'completed';
    }

    if (normalized.includes('pendiente')) {
      return 'ordered';
    }

    return 'draft';
  }

  private mapPaymentStatus(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('pagado')) {
      return 'paid';
    }

    if (normalized.includes('parcial')) {
      return 'partial';
    }

    return 'unpaid';
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
