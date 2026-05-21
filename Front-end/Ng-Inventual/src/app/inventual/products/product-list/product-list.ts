import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
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
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-list',
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
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductList implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'id',
    'image',
    'name',
    'code',
    'category',
    'subCategory',
    'brand',
    'unit',
    'variant',
    'stock',
    'price',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  searchTerm = '';
  importingProducts = false;
  pageSize = 10;
  pageSizeOptions = [10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  menuSidebarActive = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.configureProductSearch();
    this.getProducts();
  }

  ngAfterViewInit() {
    this.bindTableControls();
  }

  configureProductSearch() {
    this.dataSource.filterPredicate = (product: any, filter: string) => {
      const term = filter.trim().toLowerCase();

      if (!term) {
        return true;
      }

      const searchableValues = [
        product.name,
        product.nombreProducto,
        product.code,
        product.codigoProducto,
        product.sku
      ];

      return searchableValues.some(value =>
        String(value ?? '').toLowerCase().includes(term)
      );
    };
  }

  getProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos`)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.bindTableControls();
        },
        error: (err) => {
          console.error('Error cargando productos:', err);
          this.snackBar.open('Error al cargar productos', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  editProduct(row: any) {
    if (!this.auth.hasPermission('Productos', 'puede_editar')) {
      this.snackBar.open('No tienes permiso para editar productos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const productMapped = {
      IdProducto: row.idProducto || row.id,
      NombreProducto: row.nombreProducto || row.name,
      IdCategoria: row.idCategoria ? Number(row.idCategoria) : null,
      PrecioDeCompra: Number(row.precioDeCompra || 0),
      PrecioDeVenta: Number(row.precioDeVenta || row.price || 0),
      UnidadDeProducto: row.unidadDeProducto || row.unit || '',
      Marca: row.marca || row.brand || '',
      TipoProducto: row.tipoProducto || row.variant || '',
      ImpuestoSobreProducto: row.impuestoSobreProducto ?? null,
      Descuento: row.descuento ?? null,
      CodigoProducto: row.codigoProducto || row.code,
      StockActual: Number(row.stockActual || row.stock || 0),
      StockMinimo: row.stockMinimo ?? null,
      IdProveedor: row.idProveedor ? Number(row.idProveedor) : null,
      ImagenProducto: row.imagenProducto || null
    };

    this.router.navigate(['/product/addproduct'], {
      state: { product: productMapped }
    });
  }

  deleteProduct(id: number) {
    if (!this.auth.hasPermission('Productos', 'puede_eliminar')) {
      this.snackBar.open('No tienes permiso para desactivar productos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Seguro que deseas desactivar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.delete(`${environment.apiUrl}/api/productos/${id}`)
        .subscribe({
          next: () => {
            this.snackBar.open('Producto desactivado correctamente', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.getProducts();
          },
          error: () => {
            this.snackBar.open('Error al desactivar producto', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  reactivateProduct(id: number) {
    if (!this.auth.hasPermission('Productos', 'puede_editar')) {
      this.snackBar.open('No tienes permiso para reactivar productos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Seguro que deseas reactivar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/productos/activar/${id}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open('Producto reactivado correctamente', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.getProducts();
          },
          error: () => {
            this.snackBar.open('Error al reactivar producto', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.selection.clear();
    this.bindTableControls();
  }

  applyBarcodeSearch(event: Event) {
    event.preventDefault();
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(input: HTMLInputElement) {
    this.searchTerm = '';
    input.value = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  importProducts(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.auth.hasPermission('Productos', 'puede_crear')) {
      this.snackBar.open('No tienes permiso para importar productos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      input.value = '';
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.snackBar.open('Selecciona un archivo CSV para importar productos', 'Cerrar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    this.importingProducts = true;

    this.http.post<any>(`${environment.apiUrl}/api/productos/importar`, formData)
      .subscribe({
        next: (res) => {
          const created = res?.created ?? 0;
          const updated = res?.updated ?? 0;
          const skipped = res?.skipped ?? 0;

          this.snackBar.open(
            `Importacion completada: ${created} creados, ${updated} actualizados, ${skipped} omitidos`,
            'Cerrar',
            {
              duration: 6000,
              panelClass: ['success-snackbar']
            }
          );
          this.getProducts();
        },
        error: (err) => {
          const message = err?.error?.message || 'Error al importar productos';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.importingProducts = false;
          input.value = '';
        }
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  private bindTableControls() {
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
