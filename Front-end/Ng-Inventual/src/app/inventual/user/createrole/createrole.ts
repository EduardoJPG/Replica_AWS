import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ValidationDialog } from '../../../shared/validation-dialog/validation-dialog';

import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-createrole',
  imports: [
    CommonModule,
    Menus,
    Header,
    Footer,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './createrole.html',
  styleUrl: './createrole.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Createrole {

  menuSidebarActive = false;

  displayedColumns: string[] = [
    'nombre',
    'ver',
    'crear',
    'editar',
    'eliminar'
  ];

  role = {
    nombre: '',
    descripcion: ''
  };

  permisos: any[] = [];

  isEditMode = false;
  roleId: number | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.roleId = Number(id);
      this.isEditMode = true;
    }

    this.getPermisos();
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  getPermisos() {
    this.http.get<any[]>(`${environment.apiUrl}/api/roles/permisos`)
      .subscribe({
        next: (res) => {
          this.permisos = res.map(p => ({
            ...p,
            puede_ver: false,
            puede_crear: false,
            puede_editar: false,
            puede_eliminar: false
          }));

          if (this.isEditMode && this.roleId) {
            this.getRoleById(this.roleId);
          }
        },
        error: (err) => {
          console.error('Error al cargar permisos:', err);
          this.showValidationPopup('No se pudieron cargar los permisos. Intenta nuevamente.');
        }
      });
  }

  getRoleById(id: number) {
    this.http.get<any>(`${environment.apiUrl}/api/roles/${id}`)
      .subscribe({
        next: (res) => {
          this.role.nombre = res.nombre;
          this.role.descripcion = res.descripcion;

          this.permisos = this.permisos.map(p => {
            const permisoRol = res.permisos.find((rp: any) => rp.idPermiso === p.id);

            return {
              ...p,
              puede_ver: permisoRol ? permisoRol.puedeVer : false,
              puede_crear: permisoRol ? permisoRol.puedeCrear : false,
              puede_editar: permisoRol ? permisoRol.puedeEditar : false,
              puede_eliminar: permisoRol ? permisoRol.puedeEliminar : false
            };
          });
        },
        error: (err) => {
          console.error('Error al cargar rol:', err);
          this.showValidationPopup('No se pudo cargar el rol seleccionado. Intenta nuevamente.');
        }
      });
  }

  togglePermiso(p: any, campo: string, event: any) {
    p[campo] = event.checked;
  }

  saveRole() {
    const validationMessage = this.validateRole();

    if (validationMessage) {
      this.showValidationPopup(validationMessage);
      return;
    }

    if (this.isEditMode && this.roleId) {
      this.updateRole();
    } else {
      this.createRole();
    }
  }

  private buildPayload() {
    const permisosSeleccionados = this.permisos
      .filter(p =>
        p.puede_ver ||
        p.puede_crear ||
        p.puede_editar ||
        p.puede_eliminar
      )
      .map(p => ({
        idPermiso: p.id,
        puedeVer: p.puede_ver,
        puedeCrear: p.puede_crear,
        puedeEditar: p.puede_editar,
        puedeEliminar: p.puede_eliminar
      }));

    return {
      nombre: this.role.nombre,
      descripcion: this.role.descripcion,
      permisos: permisosSeleccionados
    };
  }

  createRole() {
    if (!this.role.nombre.trim()) {
      this.snackBar.open('El nombre del rol es obligatorio ❌', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const payload = this.buildPayload();

    this.http.post(`${environment.apiUrl}/api/roles`, payload)
      .subscribe({
        next: () => {
          this.snackBar.open('Rol creado correctamente ✅', 'Cerrar', {
            duration: 3000
          });

          // 🔥 REDIRECCIÓN
          this.router.navigate(['/client/rolelist']);
        },
        error: (err) => {
          console.error('Error al crear rol:', err);
          this.showValidationPopup(this.getErrorMessage(err, 'Error al crear rol'));
        }
      });
  }

  updateRole() {
    if (!this.role.nombre.trim()) {
      this.snackBar.open('El nombre del rol es obligatorio ❌', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const payload = this.buildPayload();

    this.http.put(`${environment.apiUrl}/api/roles/${this.roleId}`, payload)
      .subscribe({
        next: () => {
          this.snackBar.open('Rol actualizado correctamente ✅', 'Cerrar', {
            duration: 3000
          });
         
          // 🔥 REDIRECCIÓN
          this.router.navigate(['/client/rolelist']);

        },
        error: (err) => {
          console.error('Error al actualizar rol:', err);
          this.showValidationPopup(this.getErrorMessage(err, 'Error al actualizar rol'));
        }
      });
  }

  private validateRole(): string | null {
    const nombre = String(this.role.nombre || '').trim();
    const descripcion = String(this.role.descripcion || '').trim();
    const tienePermisos = this.permisos.some(p =>
      p.puede_ver ||
      p.puede_crear ||
      p.puede_editar ||
      p.puede_eliminar
    );

    if (!nombre) {
      return 'El nombre del rol es obligatorio';
    }

    if (nombre.length < 2) {
      return 'El nombre del rol debe tener al menos 2 caracteres';
    }

    if (descripcion.length > 250) {
      return 'La descripcion no debe superar 250 caracteres';
    }

    if (!tienePermisos) {
      return 'Selecciona al menos un permiso para el rol';
    }

    this.role.nombre = nombre;
    this.role.descripcion = descripcion;

    return null;
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
