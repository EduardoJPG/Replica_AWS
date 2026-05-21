import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterIcon } from '../../icons/filter-icon/filter-icon';
import { PdfIcon } from '../../icons/pdf-icon/pdf-icon';
import { CsvIcon } from '../../icons/csv-icon/csv-icon';
import { PrinterIcon } from '../../icons/printer-icon/printer-icon';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';

export interface Proveedor {
  idProveedor: number;
  nombreProveedor: string;
  nitRuc: string;
  telefono: string;
  email: string;
  direccion: string;
  estado: number;
  pais: string;
  ciudad: string;
  compania: string;
  codigoProveedor: string;
  status?: string;
}

@Component({
  selector: 'app-supplier-list',
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
    MatSnackBarModule,
    MatDialogModule,
    FilterIcon,
    PdfIcon,
    CsvIcon,
    PrinterIcon,
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SupplierList {
  displayedColumns: string[] = [
    'select',
    'nombreProveedor',
    'phone',
    'email',
    'company',
    'codigoProveedor',
    'address',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Proveedor>([]);
  selection = new SelectionModel<Proveedor>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public auth: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.obtenerProveedores();
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
  checkboxLabel(row?: Proveedor): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.idProveedor
    }`;
  }

  obtenerProveedores(): void {
    this.http.get<Proveedor[]>(`${environment.apiUrl}/api/proveedores`)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data.map(proveedor => ({
            ...proveedor,
            status: proveedor.estado == 1 ? 'Online' : 'Offline'
          }));
        },
        error: (error) => {
          console.error('Error obteniendo proveedores', error);
          this.snackBar.open(this.translationService.translateText('Error loading suppliers'), this.translationService.translateText('Close'), {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  editarProveedor(row: Proveedor): void {
    if (!this.auth.hasPermission('Proveedores', 'puede_editar')) {
      this.snackBar.open(this.translationService.translateText('No permission to edit suppliers'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.router.navigate(['/people/editsupplier', row.idProveedor]);
  }

  eliminarProveedor(id: number): void {
    if (!this.auth.hasPermission('Proveedores', 'puede_eliminar')) {
      this.snackBar.open(this.translationService.translateText('No permission to deactivate suppliers'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: this.translationService.translateText('Sure deactivate supplier?') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.delete(`${environment.apiUrl}/api/proveedores/${id}`)
        .subscribe({
          next: () => {
            this.snackBar.open(this.translationService.translateText('Supplier deactivated successfully'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.obtenerProveedores();
          },
          error: () => {
            this.snackBar.open(this.translationService.translateText('Error deactivating supplier'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  reactivarProveedor(id: number): void {
    if (!this.auth.hasPermission('Proveedores', 'puede_editar')) {
      this.snackBar.open(this.translationService.translateText('No permission to reactivate suppliers'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: this.translationService.translateText('Sure reactivate supplier?') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/proveedores/activar/${id}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open(this.translationService.translateText('Supplier reactivated successfully'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.obtenerProveedores();
          },
          error: () => {
            this.snackBar.open(this.translationService.translateText('Error reactivating supplier'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
}
