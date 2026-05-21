import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';

interface AdjustmentProduct {
  idProducto: number;
  name: string;
  code: string;
  image: string;
  unit: string;
  stock: number;
  quantity: number;
  type: 'Addition' | 'Subtraction';
}

@Component({
  selector: 'app-add-adjustment',
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
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './add-adjustment.html',
  styleUrl: './add-adjustment.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddAdjustment implements OnInit {
  displayedColumns: string[] = ['name', 'code', 'stock', 'quantity', 'type', 'action'];
  dataSource = new MatTableDataSource<AdjustmentProduct>([]);
  products: any[] = [];
  searchResults: any[] = [];
  saving = false;

  adjustment = {
    fecha: new Date(),
    bodega: '',
    observaciones: ''
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    public auth: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos`)
      .subscribe({
        next: (res) => {
          this.products = res.filter(product => product.status === 'Activo');
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

    if (!filterValue) {
      this.searchResults = [];
      return;
    }

    const selectedIds = new Set(this.dataSource.data.map(product => product.idProducto));
    this.searchResults = this.products
      .filter(product => !selectedIds.has(Number(product.idProducto || product.id)))
      .filter(product => {
        const values = [
          product.name,
          product.nombreProducto,
          product.code,
          product.codigoProducto,
          product.sku
        ];

        return values.some(value => String(value ?? '').toLowerCase().includes(filterValue));
      })
      .slice(0, 8);
  }

  addProduct(product: any) {
    const selectedProduct: AdjustmentProduct = {
      idProducto: Number(product.idProducto || product.id),
      name: product.name || product.nombreProducto,
      code: product.code || product.codigoProducto,
      image: product.image || 'assets/img/product/product-1.jpg',
      unit: product.unit || product.unidadDeProducto || 'Quantity',
      stock: Number(product.stockActual || product.stock || 0),
      quantity: 1,
      type: 'Addition'
    };

    this.dataSource.data = [...this.dataSource.data, selectedProduct];
    this.hideSearchResults();
  }

  increaseQuantity(product: AdjustmentProduct) {
    product.quantity += 1;
    this.dataSource.data = [...this.dataSource.data];
  }

  decreaseQuantity(product: AdjustmentProduct) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  removeProduct(product: AdjustmentProduct) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== product);
  }

  hideSearchResults() {
    this.searchResults = [];
  }

  saveAdjustment() {
    const validationMessage = this.validateAdjustment();
    if (validationMessage) {
      this.snackBar.open(validationMessage, 'Cerrar', {
        duration: 3500,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.auth.hasPermission('Ajustes', 'puede_crear')) {
      this.snackBar.open('No tienes permiso para crear ajustes', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = {
      fecha: this.toDateOnly(this.adjustment.fecha),
      bodega: this.adjustment.bodega,
      observaciones: this.adjustment.observaciones,
      detalles: this.dataSource.data.map(product => ({
        idProducto: product.idProducto,
        cantidad: product.quantity,
        tipo: product.type
      }))
    };

    this.saving = true;
    this.http.post(`${environment.apiUrl}/api/ajustes`, payload)
      .subscribe({
        next: () => {
          this.snackBar.open('Ajuste creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/product/adjustment']);
        },
        error: (err) => {
          const message = err?.error?.message || 'Error al crear ajuste';
          this.snackBar.open(message, 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.saving = false;
        }
      });
  }

  validateAdjustment(): string | null {
    if (!this.adjustment.fecha) {
      return 'Selecciona la fecha del ajuste';
    }

    if (!String(this.adjustment.bodega || '').trim()) {
      return 'Ingresa la bodega del ajuste';
    }

    if (this.dataSource.data.length === 0) {
      return 'Selecciona al menos un producto';
    }

    const invalidSubtraction = this.dataSource.data.find(product =>
      product.type === 'Subtraction' && product.quantity > product.stock
    );

    if (invalidSubtraction) {
      return `La salida de ${invalidSubtraction.name} supera el stock actual`;
    }

    this.adjustment.bodega = this.adjustment.bodega.trim();
    this.adjustment.observaciones = this.adjustment.observaciones?.trim() || '';

    return null;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  menuSidebarActive = false;

  private toDateOnly(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().slice(0, 10);
  }
}
