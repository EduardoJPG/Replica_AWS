import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-generate-barcode',
  imports: [
    Menus,
    Header,
    Footer,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './generate-barcode.html',
  styleUrl: './generate-barcode.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GenerateBarcode {
  displayedColumns: string[] = ['name', 'code', 'quantity', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  products: any[] = [];
  searchResults: any[] = [];
  searchText = '';
  paperSize = '50';
  showName = true;
  showCode = true;
  showPrice = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  menuSidebarActive = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos`)
      .subscribe({
        next: (res) => {
          this.products = res
            .filter(product => product.status === 'Activo')
            .map(product => ({
              ...product,
              quantity: 1,
              barcodeImage: ''
            }));
        },
        error: () => {
          this.snackBar.open('Error al cargar productos', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  updateSearchResults(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchText = filterValue;

    if (!filterValue) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.products
      .filter(product =>
        product.name?.toLowerCase().includes(filterValue) ||
        product.code?.toLowerCase().includes(filterValue)
      )
      .slice(0, 10);
  }

  addProduct(product: any) {
    const exists = this.dataSource.data.some(item => Number(item.id) === Number(product.id));
    if (exists) {
      this.searchResults = [];
      this.searchText = '';
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/api/productos/barcode/${product.id}`)
      .subscribe({
        next: (res) => {
          const item = {
            ...product,
            quantity: 1,
            barcodeSvg: res.barcodeSvg,
            barcodeImage: this.svgToDataUrl(res.barcodeSvg)
          };

          this.dataSource.data = [...this.dataSource.data, item];
          this.searchResults = [];
          this.searchText = '';
        },
        error: () => {
          this.snackBar.open('Error al generar codigo de barra', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  increaseQuantity(product: any) {
    product.quantity = this.getValidQuantity(product.quantity) + 1;
    this.dataSource.data = [...this.dataSource.data];
  }

  decreaseQuantity(product: any) {
    product.quantity = Math.max(1, this.getValidQuantity(product.quantity) - 1);
    this.dataSource.data = [...this.dataSource.data];
  }

  preventInvalidQuantityKey(event: KeyboardEvent) {
    if (['e', 'E', '+', '-', '.', ','].includes(event.key)) {
      event.preventDefault();
    }
  }

  sanitizeQuantity(product: any) {
    const digitsOnly = String(product.quantity ?? '').replace(/\D/g, '');
    product.quantity = digitsOnly ? Number(digitsOnly) : null;
    this.dataSource.data = [...this.dataSource.data];
  }

  normalizeQuantity(product: any) {
    product.quantity = this.getValidQuantity(product.quantity);
    this.dataSource.data = [...this.dataSource.data];
  }

  removeProduct(product: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== product);
  }

  get barcodeLabels() {
    return this.dataSource.data.flatMap(product =>
      Array.from({ length: product.quantity }, () => product)
    );
  }

  printBarcodes() {
    if (this.barcodeLabels.length === 0) {
      this.snackBar.open('Selecciona al menos un producto', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    window.print();
  }

  hideSearchResults() {
    this.searchResults = [];
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  private svgToDataUrl(svg: string) {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  private getValidQuantity(value: unknown) {
    const quantity = Math.floor(Number(value));
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  }
}
