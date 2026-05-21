import { Component, ViewEncapsulation } from '@angular/core';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ValidationDialog } from '../../../shared/validation-dialog/validation-dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-product',
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
    MatButtonModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddProduct {
  isEdit = false;
  categorias: any[] = [];
  proveedores: any[] = [];
  unidades: any[] = [];
  menuSidebarActive = false;
  imagePreview = '';
  imageZoomActive = false;
  imageZoomOrigin = 'center center';

  product: any = {
    IdProducto: 0,
    NombreProducto: '',
    IdCategoria: null,
    PrecioDeCompra: null,
    PrecioDeVenta: null,
    UnidadDeProducto: '',
    Marca: '',
    TipoProducto: '',
    ImpuestoSobreProducto: null,
    Descuento: null,
    CodigoProducto: '',
    StockActual: null,
    StockMinimo: null,
    IdProveedor: null,
    ImagenProducto: null
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (history.state.product) {
      this.product = { ...history.state.product };
      this.isEdit = true;
      this.product.IdCategoria = this.product.IdCategoria ? Number(this.product.IdCategoria) : null;
      this.product.IdProveedor = this.product.IdProveedor ? Number(this.product.IdProveedor) : null;
      this.product.ImagenProducto = this.product.ImagenProducto || this.product.imagenProducto || this.product.image || null;
      this.imagePreview = this.product.ImagenProducto || '';
    }
  }

  ngOnInit() {
    this.getCategorias();
    this.getProveedores();
    this.getUnidades();
  }

  saveProduct(form: any) {
    const validationMessage = this.validateProduct();

    if (validationMessage || form.invalid) {
      form.control.markAllAsTouched();
      this.showValidationPopup(validationMessage || 'Revisa los campos marcados antes de guardar el producto');
      return;
    }

    this.normalizeProduct();

    if (this.isEdit) {
      this.confirmarActualizacion(() => this.actualizarProducto());
    } else {
      this.http.post(`${environment.apiUrl}/api/productos`, this.product)
        .subscribe({
          next: () => {
            this.snackBar.open('Producto creado correctamente', 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            setTimeout(() => {
              this.router.navigate(['/product/productlist']);
            }, 1500);
          },
          error: (err) => {
            this.showValidationPopup(this.getErrorMessage(err, 'Error al crear producto'));
          }
        });
    }
  }

  actualizarProducto() {
    this.http.put(`${environment.apiUrl}/api/productos/${this.product.IdProducto}`, this.product)
      .subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado correctamente', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          setTimeout(() => {
            this.router.navigate(['/product/productlist']);
          }, 1500);
        },
        error: (err) => {
          this.showValidationPopup(this.getErrorMessage(err, 'Error al actualizar producto'));
        }
      });
  }

  validateProduct(): string | null {
    const nombre = String(this.product.NombreProducto || '').trim();
    const codigo = String(this.product.CodigoProducto || '').trim();
    const precioCompra = Number(this.product.PrecioDeCompra);
    const precioVenta = Number(this.product.PrecioDeVenta);
    const stockActual = Number(this.product.StockActual);
    const impuesto = this.product.ImpuestoSobreProducto;
    const descuento = this.product.Descuento;
    const stockMinimo = this.product.StockMinimo;

    if (!nombre) {
      return 'El nombre del producto es obligatorio';
    }

    if (!codigo) {
      return 'El codigo del producto es obligatorio';
    }

    if (!Number.isFinite(precioCompra) || precioCompra <= 0) {
      return 'El precio de compra debe ser mayor que 0';
    }

    if (!Number.isFinite(precioVenta) || precioVenta <= 0) {
      return 'El precio de venta debe ser mayor que 0';
    }

    if (!Number.isFinite(stockActual) || stockActual <= 0) {
      return 'El stock actual debe ser mayor que 0';
    }

    if (impuesto !== null && impuesto !== '' && (Number(impuesto) < 0 || Number(impuesto) > 100)) {
      return 'El impuesto debe estar entre 0 y 100';
    }

    if (descuento !== null && descuento !== '' && (Number(descuento) < 0 || Number(descuento) > 100)) {
      return 'El descuento debe estar entre 0 y 100';
    }

    if (stockMinimo !== null && stockMinimo !== '' && Number(stockMinimo) < 0) {
      return 'El stock minimo no puede ser negativo';
    }

    return null;
  }

  normalizeProduct() {
    this.product.NombreProducto = String(this.product.NombreProducto || '').trim();
    this.product.CodigoProducto = String(this.product.CodigoProducto || '').trim();
    this.product.PrecioDeCompra = Number(this.product.PrecioDeCompra);
    this.product.PrecioDeVenta = Number(this.product.PrecioDeVenta);
    this.product.StockActual = Number(this.product.StockActual);
    this.product.ImpuestoSobreProducto = this.product.ImpuestoSobreProducto === '' ? null : this.product.ImpuestoSobreProducto;
    this.product.Descuento = this.product.Descuento === '' ? null : this.product.Descuento;
    this.product.StockMinimo = this.product.StockMinimo === '' ? null : this.product.StockMinimo;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showValidationPopup('Selecciona un archivo de imagen valido');
      input.value = '';
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      this.showValidationPopup('La imagen no debe superar 2 MB');
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result || '');
      this.product.ImagenProducto = image;
      this.imagePreview = image;
    };

    reader.readAsDataURL(file);
  }

  removeImage(fileInput: HTMLInputElement) {
    this.product.ImagenProducto = null;
    this.imagePreview = '';
    this.clearImageZoom();
    fileInput.value = '';
  }

  setImageZoom(event: MouseEvent) {
    if (!this.imagePreview) {
      return;
    }

    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    this.imageZoomOrigin = `${x}% ${y}%`;
    this.imageZoomActive = true;
  }

  clearImageZoom() {
    this.imageZoomActive = false;
    this.imageZoomOrigin = 'center center';
  }

  getCategorias() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos/categorias`)
      .subscribe({
        next: (res) => {
          this.categorias = res;
        },
        error: (err) => {
          console.error('Error al cargar categorias:', err);
        }
      });
  }

  getProveedores() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos/proveedores`)
      .subscribe({
        next: (res) => {
          this.proveedores = res;
        },
        error: (err) => {
          console.error('Error al cargar proveedores:', err);
        }
      });
  }

  getUnidades() {
    this.http.get<any[]>(`${environment.apiUrl}/api/productos/unidades`)
      .subscribe({
        next: (res) => {
          this.unidades = res;
        },
        error: (err) => {
          console.error('Error al cargar unidades:', err);
          this.showValidationPopup('No se pudieron cargar las unidades. Intenta nuevamente.');
        }
      });
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  private showValidationPopup(message: string) {
    this.dialog.open(ValidationDialog, {
      width: '420px',
      maxWidth: '92vw',
      panelClass: 'modern-validation-dialog',
      data: {
        title: 'No se puede guardar',
        message
      }
    });
  }

  private confirmarActualizacion(onConfirm: () => void) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Deseas actualizar la informacion?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        onConfirm();
      }
    });
  }

  private getErrorMessage(err: any, fallback: string) {
    if (err?.error?.message) {
      return err.error.message;
    }

    if (typeof err?.error === 'string' && err.error.trim()) {
      return err.error;
    }

    return fallback;
  }
}
