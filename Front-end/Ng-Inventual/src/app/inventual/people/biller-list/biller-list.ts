import {
  Component,
  ViewChild,
  ViewEncapsulation,
  inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FilterIcon } from '../../icons/filter-icon/filter-icon';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';

export interface Facturador {

  idFacturador: number;
  nombreFacturador: string;
  nitRuc: string;
  telefono: string;
  email: string;
  direccion: string;
  estado: number;
  pais: string;
  ciudad: string;
  compania: string;
  codigoFacturador: string;
  status?: string;
}

@Component({
  selector: 'app-biller-list',

  standalone: true,

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
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    FilterIcon,
  ],

  templateUrl: './biller-list.html',
  styleUrl: './biller-list.scss',
  encapsulation: ViewEncapsulation.None,
})

export class BillerList implements OnInit, AfterViewInit {

  private http = inject(HttpClient);

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  public auth = inject(AuthService);
  public translationService = inject(TranslationService);

  displayedColumns: string[] = [
    'idFacturador',
    'nombreFacturador',
    'telefono',
    'email',
    'codigoFacturador',
    'direccion',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<Facturador>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {

    this.obtenerFacturadores();
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
  }

  obtenerFacturadores(): void {

    this.http
      .get<Facturador[]>(`${environment.apiUrl}/api/facturadores`)
      .subscribe({

        next: (data) => {

          console.log('FACTURADORES:', data);

          this.dataSource.data = data.map(facturador => ({
            ...facturador,
            status: facturador.estado == 1 ? 'Online' : 'Offline'
          }));
        },

        error: (error) => {

          console.error(
            'Error obteniendo facturadores',
            error
          );
          this.snackBar.open(this.translationService.translateText('Error loading billers'), this.translationService.translateText('Close'), {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        },
      });
  }

  applyFilter(event: Event): void {

    const filterValue =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {

      this.dataSource.paginator.firstPage();
    }
  }

  editarFacturador(row: Facturador): void {
    if (!this.auth.hasPermission('Facturadores', 'puede_editar')) {
      this.snackBar.open(this.translationService.translateText('No permission to edit billers'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    console.log('Editar facturador:', row.idFacturador);

    this.router.navigate([
      '/people/editbiller',
      row.idFacturador
    ]);
  }

  eliminarFacturador(id: number): void {
    if (!this.auth.hasPermission('Facturadores', 'puede_eliminar')) {
      this.snackBar.open(this.translationService.translateText('No permission to deactivate billers'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: this.translationService.translateText('Sure deactivate biller?') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http
        .delete(
          `${environment.apiUrl}/api/facturadores/${id}`
        )
        .subscribe({

          next: () => {

            this.snackBar.open(this.translationService.translateText('Biller deactivated successfully'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['success-snackbar']
            });

            this.obtenerFacturadores();
          },

          error: () => {

            this.snackBar.open(this.translationService.translateText('Error deactivating biller'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          },
        });
    });
  }

  reactivarFacturador(id: number): void {
    if (!this.auth.hasPermission('Facturadores', 'puede_editar')) {
      this.snackBar.open(this.translationService.translateText('No permission to reactivate billers'), this.translationService.translateText('Close'), {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: this.translationService.translateText('Sure reactivate biller?') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/facturadores/activar/${id}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open(this.translationService.translateText('Biller reactivated successfully'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['success-snackbar']
            });

            this.obtenerFacturadores();
          },
          error: () => {
            this.snackBar.open(this.translationService.translateText('Error reactivating biller'), this.translationService.translateText('Close'), {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          },
        });
    });
  }

  menuSidebarActive: boolean = false;

  myfunction(): void {

    this.menuSidebarActive =
      !this.menuSidebarActive;
  }
}
