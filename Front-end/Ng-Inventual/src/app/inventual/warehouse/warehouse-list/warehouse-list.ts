import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
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
import { FilterIcon } from '../../icons/filter-icon/filter-icon';
import { PdfIcon } from '../../icons/pdf-icon/pdf-icon';
import { CsvIcon } from '../../icons/csv-icon/csv-icon';
import { PrinterIcon } from '../../icons/printer-icon/printer-icon';
import { AddWarehouse } from '../popup/add-warehouse/add-warehouse';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';

export interface Bodega {
  idBodega: number;
  nombreBodega: string;
  warehouse: string;
  telefono: string;
  phone: string;
  email: string;
  direccion: string;
  address: string;
  ciudad: string;
  pais: string;
  zip: string;
  estado: number;
  status: string;
}

@Component({
  selector: 'app-warehouse-list',
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
    MatDialogModule,
    MatSnackBarModule,
    FilterIcon,
    PdfIcon,
    CsvIcon,
    PrinterIcon,
  ],
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class WarehouseList implements OnInit {
  displayedColumns: string[] = [
    'select',
    'id',
    'warehouse',
    'phone',
    'email',
    'address',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Bodega>([]);
  selection = new SelectionModel<Bodega>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public auth: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.obtenerBodegas();
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
  checkboxLabel(row?: Bodega): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.idBodega
    }`;
  }

  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  addWarehouse() {
    const dialogRef = this.dialog.open(AddWarehouse, {
      width: '720px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerBodegas();
      }
    });
  }

  editarBodega(row: Bodega) {
    if (!this.auth.hasPermission('Bodegas', 'puede_editar')) {
      this.snackBar.open(this.translationService.translateText('No permission to edit warehouses'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(AddWarehouse, {
      width: '720px',
      data: { bodega: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerBodegas();
      }
    });
  }

  inactivarBodega(id: number) {
    if (!this.auth.hasPermission('Bodegas', 'puede_eliminar')) {
      this.snackBar.open(this.translationService.translateText('No permission to deactivate warehouses'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: this.translationService.translateText('Sure deactivate warehouse?') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.delete(`${environment.apiUrl}/api/bodegas/${id}`)
        .subscribe({
          next: () => {
            this.snackBar.open(this.translationService.translateText('Warehouse deactivated successfully'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.obtenerBodegas();
          },
          error: () => {
            this.snackBar.open(this.translationService.translateText('Error deactivating warehouse'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  reactivarBodega(id: number) {
    if (!this.auth.hasPermission('Bodegas', 'puede_editar')) {
      this.snackBar.open(this.translationService.translateText('No permission to reactivate warehouses'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: this.translationService.translateText('Sure reactivate warehouse?') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/bodegas/activar/${id}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open(this.translationService.translateText('Warehouse reactivated successfully'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.obtenerBodegas();
          },
          error: () => {
            this.snackBar.open(this.translationService.translateText('Error reactivating warehouse'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  private obtenerBodegas() {
    this.http.get<Bodega[]>(`${environment.apiUrl}/api/bodegas`)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        },
        error: () => {
          this.snackBar.open(this.translationService.translateText('Error loading warehouses'), this.translationService.translateText('Close'), {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
