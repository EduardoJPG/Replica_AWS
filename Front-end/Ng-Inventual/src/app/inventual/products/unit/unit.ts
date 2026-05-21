import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

interface Unidad {
  id: number;
  idUnidad: number;
  nombre: string;
  name: string;
  nombreCorto: string;
  shortName: string;
  estado: number | boolean;
  status: string;
}

@Component({
  selector: 'app-unit',
  imports: [
    Menus,
    Header,
    Footer,
    CommonModule,
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
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './unit.html',
  styleUrl: './unit.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Unit implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'shortName', 'status', 'action'];
  dataSource = new MatTableDataSource<Unidad>([]);
  selection = new SelectionModel<Unidad>(true, []);
  unidad = {
    idUnidad: 0,
    nombre: '',
    nombreCorto: ''
  };
  editMode = false;
  saving = false;
  searchTerm = '';
  pageSize = 10;
  pageSizeOptions = [10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  menuSidebarActive = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.configureSearch();
    this.getUnidades();
  }

  ngAfterViewInit() {
    this.bindTableControls();
  }

  getUnidades() {
    this.http.get<Unidad[]>(`${environment.apiUrl}/api/productos/unidades?includeInactive=true`)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.bindTableControls();
        },
        error: (err) => {
          console.error('Error cargando unidades:', err);
          this.snackBar.open('Error al cargar unidades', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  guardarUnidad() {
    const validationMessage = this.validarUnidad();
    if (validationMessage) {
      this.snackBar.open(validationMessage, 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const permissionAction = this.editMode ? 'puede_editar' : 'puede_crear';
    const permissionMessage = this.editMode
      ? 'No tienes permiso para editar unidades'
      : 'No tienes permiso para crear unidades';

    if (!this.auth.hasPermission('Unidades', permissionAction)) {
      this.snackBar.open(permissionMessage, 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = {
      nombre: this.unidad.nombre.trim(),
      nombreCorto: this.unidad.nombreCorto.trim()
    };

    if (this.editMode) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '350px',
        data: { message: 'Deseas actualizar la informacion?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.ejecutarGuardadoUnidad(payload);
        }
      });
      return;
    }

    this.ejecutarGuardadoUnidad(payload);
  }

  ejecutarGuardadoUnidad(payload: { nombre: string; nombreCorto: string }) {
    this.saving = true;
    const request = this.editMode
      ? this.http.put(`${environment.apiUrl}/api/productos/unidades/${this.unidad.idUnidad}`, payload)
      : this.http.post(`${environment.apiUrl}/api/productos/unidades`, payload);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.editMode ? 'Unidad actualizada correctamente' : 'Unidad creada correctamente',
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['success-snackbar']
          }
        );
        this.resetForm();
        this.getUnidades();
      },
      error: (err) => {
        this.snackBar.open(this.getErrorMessage(err, 'Error al guardar unidad'), 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  editarUnidad(row: Unidad) {
    if (!this.auth.hasPermission('Unidades', 'puede_editar')) {
      this.snackBar.open('No tienes permiso para editar unidades', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.editMode = true;
    this.unidad = {
      idUnidad: Number(row.idUnidad || row.id),
      nombre: row.nombre || row.name,
      nombreCorto: row.nombreCorto || row.shortName
    };
  }

  inactivarUnidad(id: number) {
    if (!this.auth.hasPermission('Unidades', 'puede_eliminar')) {
      this.snackBar.open('No tienes permiso para desactivar unidades', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Seguro que deseas desactivar esta unidad?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.delete(`${environment.apiUrl}/api/productos/unidades/${id}`)
        .subscribe({
          next: () => {
            this.snackBar.open('Unidad desactivada correctamente', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.getUnidades();
          },
          error: () => {
            this.snackBar.open('Error al desactivar unidad', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  reactivarUnidad(id: number) {
    if (!this.auth.hasPermission('Unidades', 'puede_editar')) {
      this.snackBar.open('No tienes permiso para reactivar unidades', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Seguro que deseas reactivar esta unidad?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.put(`${environment.apiUrl}/api/productos/unidades/activar/${id}`, {})
        .subscribe({
          next: () => {
            this.snackBar.open('Unidad reactivada correctamente', 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.getUnidades();
          },
          error: () => {
            this.snackBar.open('Error al reactivar unidad', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
  }

  resetForm() {
    this.editMode = false;
    this.unidad = {
      idUnidad: 0,
      nombre: '',
      nombreCorto: ''
    };
  }

  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(input: HTMLInputElement) {
    this.searchTerm = '';
    input.value = '';
    this.dataSource.filter = '';

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

  checkboxLabel(row?: Unidad): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  private configureSearch() {
    this.dataSource.filterPredicate = (unidad: Unidad, filter: string) => {
      const term = filter.trim().toLowerCase();
      return [
        unidad.nombre,
        unidad.name,
        unidad.nombreCorto,
        unidad.shortName,
        unidad.status
      ].some(value => String(value ?? '').toLowerCase().includes(term));
    };
  }

  private validarUnidad(): string | null {
    if (!this.unidad.nombre.trim()) {
      return 'El nombre de la unidad es obligatorio';
    }

    if (!this.unidad.nombreCorto.trim()) {
      return 'El nombre corto es obligatorio';
    }

    if (this.unidad.nombre.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }

    return null;
  }

  private getErrorMessage(err: any, fallback: string) {
    return err?.error?.message || fallback;
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
