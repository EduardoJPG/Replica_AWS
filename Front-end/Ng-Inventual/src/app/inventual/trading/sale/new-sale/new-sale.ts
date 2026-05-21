import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductInterfaceData } from '../../../data/productData';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Menus } from '../../../layout/header/menus/menus';
import { Header } from '../../../layout/header/header/header';
import { Footer } from '../../../layout/footer/footer/footer';
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
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-new-sale',
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
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './new-sale.html',
  styleUrl: './new-sale.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NewSale implements OnInit {
  displayedColumns: string[] = [
    'image',
    'name',
    'code',
    'unit',
    'price',
    'quantity',
    'tax',
    'discount',
    'subTotal',
    'action',
  ];
  dataSource: MatTableDataSource<ProductInterfaceData> =
    new MatTableDataSource<ProductInterfaceData>([]);
  totalAmount: number = 0;
  totalDiscount: number = 0;
  totalTax: number = 0;
  shippingValue: number = 0;
  products: ProductInterfaceData[] = [];
  searchResults: ProductInterfaceData[] = [];
  warehouses: any[] = [];
  billers: any[] = [];
  isSaving = false;
  editingSaleId: number | null = null;
  sale = {
    fecha: new Date(),
    cliente: 'Cliente general',
    idBodega: null as number | null,
    idFacturador: null as number | null,
    metodoPago: 'Manual',
    nota: '',
    observaciones: '',
  };

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Assign an empty array to the data source initially
    this.dataSource = new MatTableDataSource<ProductInterfaceData>([]);
    this.calculateSubtotals();
    this.calculateTotalAmount();
    this.calculateTotalDiscount();
    this.calculateTotalTax();
  }

  ngOnInit() {
    this.loadProducts();
    this.loadWarehouses();
    this.loadBillers();

    const editId = Number(this.route.snapshot.queryParamMap.get('edit'));
    if (editId) {
      this.editingSaleId = editId;
      this.loadSale(editId);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  addProductToTable(product: ProductInterfaceData) {
    this.toggleSelected(product);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateSubtotal(product: ProductInterfaceData): number {
    const price = product.price || 0;
    const quantity = product.quantity || 0;
    const tax = product.tax || 0;
    const discount = product.discount || 0;

    return (
      price * quantity +
      (price * quantity * tax) / 100 -
      (price * quantity * discount) / 100
    );
  }

  calculateSubtotals() {
    this.dataSource.data.forEach((product) => {
      product.subTotal = this.calculateSubtotal(product);
    });
  }
  calculateTotalAmount() {
    this.totalAmount = this.dataSource.data.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }

  calculateTotalDiscount() {
    this.totalDiscount = this.dataSource.data.reduce(
      (acc, product) =>
        acc + (product.discount / 100) * product.price * product.quantity,
      0
    );
  }

  calculateTotalTax() {
    this.totalTax = this.dataSource.data.reduce(
      (acc, product) =>
        acc + (product.tax / 100) * product.price * product.quantity,
      0
    );
  }

  increaseQuantity(product: ProductInterfaceData) {
    if (product.stock && product.quantity >= product.stock) {
      this.showMessage('No hay suficiente stock disponible');
      return;
    }

    product.quantity += 1;
    this.updateValues();
  }

  decreaseQuantity(product: ProductInterfaceData) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.updateValues();
    }
  }

  updateValues() {
    this.calculateSubtotals();
    this.calculateTotalAmount();
    this.calculateTotalDiscount();
    this.calculateTotalTax();
  }
  removeProduct(product: ProductInterfaceData) {
    const index = this.dataSource.data.indexOf(product);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data]; // Triggering change detection
      this.updateValues();
    }
  }

  updateSearchResults(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    if (!filterValue) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.products.filter((product) => {
      const code = String(product.code || '').toLowerCase();
      return product.name.toLowerCase().includes(filterValue) || code.includes(filterValue);
    });
  }

  toggleSelected(product: ProductInterfaceData) {
    const exists = this.dataSource.data.some((item) => item.id === product.id);
    if (exists) {
      this.showMessage('El producto ya esta agregado a la venta');
      return;
    }

    const selectedProduct = {
      ...product,
      selected: true,
      quantity: 1,
      subTotal: 0,
    };

    this.dataSource.data = [...this.dataSource.data, selectedProduct];
    this.updateValues();
    this.hideSearchResults();
  }

  addSelectedProductsToTable() {
    this.dataSource.data = [
      ...this.searchResults.filter((product) => product.selected),
    ];
    this.updateValues();
  }

  hideSearchResults() {
    this.searchResults = [];
  }

  guardarVenta() {
    if (this.dataSource.data.length === 0) {
      this.showMessage('Selecciona al menos un producto');
      return;
    }

    const payload = {
      fecha: this.sale.fecha,
      cliente: this.sale.cliente,
      idBodega: this.sale.idBodega,
      idFacturador: this.sale.idFacturador,
      envio: Number(this.shippingValue) || 0,
      metodoPago: this.sale.metodoPago,
      nota: this.sale.nota,
      observaciones: this.sale.observaciones,
      detalles: this.dataSource.data.map((product) => ({
        idProducto: Number(product.id),
        cantidad: Number(product.quantity) || 1,
        precioUnitario: Number(product.price) || 0,
        descuento: Number(product.discount) || 0,
        impuesto: Number(product.tax) || 0,
      })),
    };

    this.isSaving = true;
    const request = this.editingSaleId
      ? this.http.put<any>(`${environment.apiUrl}/api/ventas/${this.editingSaleId}`, payload)
      : this.sale.metodoPago === 'Stripe'
        ? this.http.post<any>(`${environment.apiUrl}/api/ventas/stripe-checkout`, payload)
        : this.http.post<any>(`${environment.apiUrl}/api/ventas`, payload);

    request.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (!this.editingSaleId && this.sale.metodoPago === 'Stripe' && res?.checkoutUrl) {
          window.location.href = res.checkoutUrl;
          return;
        }

        this.showMessage(res?.message || 'Venta guardada correctamente');
        this.router.navigate(['/trading/sales/managesale']);
      },
      error: (err) => {
        this.isSaving = false;
        this.showMessage(err?.error?.message || 'No se pudo guardar la venta');
      },
    });
  }

  private loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos`).subscribe({
      next: (data) => {
        this.products = data
          .filter((product) => Number(product.stockActual ?? product.stock ?? 0) > 0)
          .map((product) => ({
            id: product.idProducto ?? product.id,
            image: product.image || product.imagenProducto || 'assets/img/product/product-1.jpg',
            name: product.name || product.nombreProducto,
            code: product.code || product.codigoProducto,
            category: product.category || product.categoria || '',
            subCategory: product.subCategory || product.tipoProducto || '',
            brand: product.brand || product.marca || '',
            unit: product.unit || product.unidadDeProducto || '',
            variant: product.variant || product.tipoProducto || '',
            stock: Number(product.stockActual ?? product.stock ?? 0),
            price: Number(product.price ?? product.precioDeVenta ?? 0),
            tax: Number(product.impuestoSobreProducto ?? product.tax ?? 0),
            discount: Number(product.descuento ?? product.discount ?? 0),
            subTotal: 0,
            quantity: 1,
          }));
      },
      error: () => this.showMessage('No se pudieron cargar los productos'),
    });
  }

  private loadWarehouses() {
    this.http.get<any[]>(`${environment.apiUrl}/api/bodegas`).subscribe({
      next: (data) => {
        this.warehouses = data.filter((warehouse) => Number(warehouse.estado) === 1);
      },
      error: () => this.showMessage('No se pudieron cargar las bodegas'),
    });
  }

  private loadBillers() {
    this.http.get<any[]>(`${environment.apiUrl}/api/facturadores`).subscribe({
      next: (data) => {
        this.billers = data.filter((biller) => Number(biller.estado) === 1);
      },
      error: () => this.showMessage('No se pudieron cargar los facturadores'),
    });
  }

  private loadSale(id: number) {
    this.http.get<any>(`${environment.apiUrl}/api/ventas/${id}`).subscribe({
      next: (sale) => {
        if (String(sale.estadoPago || sale.payment).toLowerCase() === 'pagado') {
          this.showMessage('Solo se pueden editar ventas pendientes');
          this.router.navigate(['/trading/sales/managesale']);
          return;
        }

        this.sale = {
          fecha: new Date(sale.fecha || sale.date),
          cliente: sale.cliente || sale.customer || 'Cliente general',
          idBodega: sale.idBodega ? Number(sale.idBodega) : null,
          idFacturador: sale.idFacturador ? Number(sale.idFacturador) : null,
          metodoPago: sale.metodoPago || sale.paymentMethod || 'Manual',
          nota: sale.nota || '',
          observaciones: sale.observaciones || '',
        };
        this.shippingValue = Number(sale.envio) || 0;
        this.dataSource.data = (sale.detalles || []).map((detail: any) => ({
          id: detail.idProducto,
          image: 'assets/img/product/product-1.jpg',
          name: detail.name || detail.nombreProducto,
          code: detail.code || detail.codigoProducto,
          category: '',
          subCategory: '',
          brand: '',
          unit: detail.unit || detail.unidad || '',
          variant: '',
          stock: 0,
          price: Number(detail.price || detail.precioUnitario || 0),
          tax: Number(detail.tax || detail.impuesto || 0),
          discount: Number(detail.discount || detail.descuento || 0),
          subTotal: Number(detail.subTotal || detail.subtotal || 0),
          quantity: Number(detail.quantity || detail.cantidad || 1),
        }));
        this.updateValues();
      },
      error: () => this.showMessage('No se pudo cargar la venta para editar'),
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
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
}
