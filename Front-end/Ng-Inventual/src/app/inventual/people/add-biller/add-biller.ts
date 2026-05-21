import { Component, ViewEncapsulation } from '@angular/core';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslationService } from '../../../services/translation.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-biller',
  imports: [
    Menus,
    Header,
    Footer,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './add-biller.html',
  styleUrl: './add-biller.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddBiller {

  // sidebar
  menuSidebarActive: boolean = false;

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // =========================
  // MODO EDICIÓN
  // =========================
  idFacturador: number | null = null;
  modoEdicion: boolean = false;

  // =========================
  // MODELO
  // =========================
  facturador = {
    nombreFacturador: '',
    nitRuc: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: true,
    pais: '',
    ciudad: '',
    compania: '',
    codigoFacturador: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {

    this.idFacturador = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idFacturador) {
      this.modoEdicion = true;
      this.cargarFacturador(this.idFacturador);
    }
  }

  // =========================
  // CARGAR DATOS
  // =========================
  cargarFacturador(id: number): void {

    this.http.get<any>(`${environment.apiUrl}/api/facturadores/${id}`)
      .subscribe({

        next: (data) => {

          this.facturador = {
            nombreFacturador: data.nombreFacturador,
            nitRuc: data.nitRuc,
            telefono: data.telefono,
            email: data.email,
            direccion: data.direccion,
            estado: data.estado == 1,
            pais: data.pais,
            ciudad: data.ciudad,
            compania: data.compania,
            codigoFacturador: data.codigoFacturador
          };
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // =========================
  // GUARDAR / ACTUALIZAR
  // =========================
  guardarFacturador() {

    // ================= EDITAR =================
    if (this.modoEdicion) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '350px',
        data: { message: this.translationService.translateText('Do you want to update the information?') }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.actualizarFacturador();
        }
      });

      return;
    }

    // ================= CREAR =================
    this.http.post(
      `${environment.apiUrl}/api/facturadores`,
      this.facturador
    ).subscribe({

      next: () => {

        alert(this.translationService.translateText('Biller created successfully'));

        this.router.navigate(['/people/billerlist']);
      },

      error: (err) => {

        console.error(err);

        alert(err.error?.message || this.translationService.translateText('Error saving biller'));
      }
    });
  }

  actualizarFacturador() {
    this.http.put(
      `${environment.apiUrl}/api/facturadores/${this.idFacturador}`,
      this.facturador
    ).subscribe({

      next: () => {

        alert(this.translationService.translateText('Biller updated successfully'));

        this.router.navigate(['/people/billerlist']);
      },

      error: (err) => {

        console.error(err);

        alert(err.error?.message || this.translationService.translateText('Error updating biller'));
      }
    });
  }
}
