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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../../services/translation.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-supplier',
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
    HttpClientModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './add-supplier.html',
  styleUrl: './add-supplier.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddSupplier {
  menuSidebarActive: boolean = false;

  idProveedor: number | null = null;
  modoEdicion: boolean = false;

  proveedor = {
    nombreProveedor: '',
    nitRuc: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: true,
    pais: '',
    ciudad: '',
    compania: '',
    codigoProveedor: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.idProveedor = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idProveedor) {
      this.modoEdicion = true;
      this.cargarProveedor(this.idProveedor);
    }
  }

  cargarProveedor(id: number): void {
    this.http.get<any>(`${environment.apiUrl}/api/proveedores/${id}`)
      .subscribe({
        next: (data) => {
          this.proveedor = {
            nombreProveedor: data.nombreProveedor,
            nitRuc: data.nitRuc,
            telefono: data.telefono,
            email: data.email,
            direccion: data.direccion,
            estado: data.estado == 1,
            pais: data.pais,
            ciudad: data.ciudad,
            compania: data.compania,
            codigoProveedor: data.codigoProveedor
          };
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || this.translationService.translateText('Error loading supplier'));
        }
      });
  }

  guardarProveedor(): void {
    if (this.modoEdicion) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '350px',
        data: { message: this.translationService.translateText('Do you want to update the information?') }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.actualizarProveedor();
        }
      });

      return;
    }

    this.http.post(
      `${environment.apiUrl}/api/proveedores`,
      this.proveedor
    ).subscribe({
      next: () => {
        alert(this.translationService.translateText('Supplier created successfully'));
        this.router.navigate(['/people/supplierlist']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || this.translationService.translateText('Error saving supplier'));
      }
    });
  }

  actualizarProveedor(): void {
    this.http.put(
        `${environment.apiUrl}/api/proveedores/${this.idProveedor}`,
        this.proveedor
      ).subscribe({
        next: () => {
          alert(this.translationService.translateText('Supplier updated successfully'));
          this.router.navigate(['/people/supplierlist']);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || this.translationService.translateText('Error updating supplier'));
        }
      });
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
}
