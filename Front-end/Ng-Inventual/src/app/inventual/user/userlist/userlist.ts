import { AfterViewInit, Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';

import { FilterIcon } from '../../icons/filter-icon/filter-icon';
import { PdfIcon } from '../../icons/pdf-icon/pdf-icon';
import { CsvIcon } from '../../icons/csv-icon/csv-icon';
import { PrinterIcon } from '../../icons/printer-icon/printer-icon';

import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-userlist',
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
    FilterIcon,
    PdfIcon,
    CsvIcon,
    PrinterIcon,
    MatDialogModule,
  ],
  templateUrl: './userlist.html',
  styleUrl: './userlist.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Userlist implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'phone',
    'email',
    'role',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  pageSize = 10;
  pageSizeOptions = [10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  menuSidebarActive = false;
  hide = true;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {
    this.bindTableControls();
  }

  getUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/api/usuarios`)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.bindTableControls();
        },
        error: (err) => {
          console.error('Error cargando usuarios:', err);
          this.snackBar.open('Error al cargar usuarios ❌', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  editUser(row: any) {
    if (!this.auth.hasPermission('Usuarios', 'puede_editar')) {
      this.snackBar.open('No tienes permiso para editar usuarios ❌', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const userMapped = {
      IdUsuario: row.id,
      Nombre: row.fullName || row.name,
      NombreUsuario: row.username || row.name,
      Email: row.email,
      Password: '',
      IdRol: Number(row.roleId),
      Genero: row.genero || '',
      Telefono: row.phone,
      FotoPerfil: row.fotoPerfil || ''
    };

    this.router.navigate(['/client/adduser'], {
      state: { user: userMapped }
    });
  }

  deleteUser(id: number) {
    const currentUser = this.auth.getUser();
    if (Number(currentUser?.id) === Number(id)) {
      this.snackBar.open('No puedes desactivar el usuario con el que iniciaste sesion', 'Cerrar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.auth.hasPermission('Usuarios', 'puede_eliminar')) {
      this.snackBar.open('No tienes permiso para desactivar usuarios ❌', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        message: '¿Seguro que deseas desactivar este usuario?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.delete(`${environment.apiUrl}/api/usuarios/${id}`)
        .subscribe({
          next: () => {
            this.snackBar.open('Usuario desactivado correctamente 🚫', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });

            this.getUsers();
          },
          error: () => {
            this.snackBar.open('Error al desactivar usuario ❌', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  reactivateUser(id: number) {
    if (!this.auth.hasPermission('Usuarios', 'puede_editar')) {
      this.snackBar.open('No tienes permiso para reactivar usuarios ❌', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        message: '¿Seguro que deseas reactivar este usuario?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/usuarios/activar/${id}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open('Usuario reactivado correctamente ✅', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });

            this.getUsers();
          },
          error: () => {
            this.snackBar.open('Error al reactivar usuario ❌', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  isCurrentUser(id: number) {
    const currentUser = this.auth.getUser();
    return Number(currentUser?.id) === Number(id);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.selection.clear();
    this.bindTableControls();
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
