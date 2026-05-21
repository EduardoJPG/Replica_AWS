import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-role-list',
  imports: [
    CommonModule,
    RouterModule,
    Menus,
    Header,
    Footer,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RoleList {
  menuSidebarActive = false;

  displayedColumns: string[] = [
    'idRol',
    'nombre',
    'descripcion',
    'estado',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  getRoles() {
    this.http.get<any[]>(`${environment.apiUrl}/api/roles`)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al cargar roles ❌', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editRole(row: any) {
    this.router.navigate(['/client/createrole', row.idRol]);
  }

  deactivateRole(idRol: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        message: '¿Seguro que deseas desactivar este rol?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/roles/desactivar/${idRol}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open('Rol desactivado correctamente 🚫', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });

            this.getRoles();
          },
          error: () => {
            this.snackBar.open('Error al desactivar rol ❌', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  reactivateRole(idRol: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        message: '¿Seguro que deseas reactivar este rol?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/roles/reactivar/${idRol}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open('Rol reactivado correctamente ✅', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });

            this.getRoles();
          },
          error: () => {
            this.snackBar.open('Error al reactivar rol ❌', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }
}