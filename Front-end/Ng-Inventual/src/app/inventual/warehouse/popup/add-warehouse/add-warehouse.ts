import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { ConfirmDialog } from '../../../../shared/confirm-dialog/confirm-dialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-warehouse',
  imports: [
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-warehouse.html',
  styleUrl: './add-warehouse.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddWarehouse {
  bodega = {
    nombreBodega: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    pais: '',
    zip: '',
    estado: true
  };

  modoEdicion = false;
  idBodega: number | null = null;
  guardando = false;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddWarehouse>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.bodega) {
      this.modoEdicion = true;
      this.idBodega = data.bodega.idBodega;
      this.bodega = {
        nombreBodega: data.bodega.nombreBodega || data.bodega.warehouse || '',
        telefono: data.bodega.telefono || data.bodega.phone || '',
        email: data.bodega.email || '',
        direccion: data.bodega.direccion || data.bodega.address || '',
        ciudad: data.bodega.ciudad || '',
        pais: data.bodega.pais || '',
        zip: data.bodega.zip || '',
        estado: data.bodega.estado == 1
      };
    }
  }

  guardarBodega(): void {
    if (!this.bodega.nombreBodega.trim()) {
      this.snackBar.open(this.translationService.translateText('Warehouse name required'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.modoEdicion) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '350px',
        data: { message: this.translationService.translateText('Do you want to update the information?') }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.ejecutarGuardadoBodega();
        }
      });
      return;
    }

    this.ejecutarGuardadoBodega();
  }

  ejecutarGuardadoBodega(): void {
    this.guardando = true;
    const request = this.modoEdicion
      ? this.http.put(`${environment.apiUrl}/api/bodegas/${this.idBodega}`, this.bodega)
      : this.http.post(`${environment.apiUrl}/api/bodegas`, this.bodega);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.translationService.translateText(this.modoEdicion ? 'Warehouse updated successfully' : 'Warehouse created successfully'),
          this.translationService.translateText('Close'),
          {
            duration: 4000,
            panelClass: ['success-snackbar']
          }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || this.translationService.translateText(this.modoEdicion ? 'Error updating warehouse' : 'Error saving warehouse'),
          this.translationService.translateText('Close'),
          {
            duration: 4000,
            panelClass: ['error-snackbar']
          }
        );
      },
      complete: () => {
        this.guardando = false;
      }
    });
  }
}
