import { Component, ViewEncapsulation } from '@angular/core';

import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ValidationDialog } from '../../../shared/validation-dialog/validation-dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [
    CommonModule,
    Menus,
    Header,
    Footer,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './adduser.html',
  styleUrl: './adduser.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Adduser {

  // 🔥 bandera para saber si es edición
  isEdit = false;
  roles: any[] = [];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    // ✅ forma correcta (persistente)
    if (history.state.user) {
      this.user = { ...history.state.user };
      this.isEdit = true;
      this.user.IdRol = Number(this.user.IdRol);
      // ⚠️ nunca cargar password en edición
      this.user.Password = '';
    }
  }

  // ✅ modelo completo
  user: any = {
    IdUsuario: 0,
    Nombre: '',
    NombreUsuario: '',
    Email: '',
    Password: '',
    IdRol: 0,
    Genero: '',
    Telefono: '',
    FotoPerfil: ''
  };

  ngOnInit() {
    this.getRoles();
  }

  createUser(form: any) {
    const validationMessage = this.validateUser();

    if (validationMessage || form.invalid) {
      form.control.markAllAsTouched();
      this.showValidationPopup(validationMessage || 'Revisa los campos marcados antes de guardar el usuario');
      return;
    }

    // 🔥 UPDATE
    if (this.isEdit) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '350px',
        data: { message: 'Deseas actualizar la informacion?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateUser();
        }
      });

      return;

      /*

      this.http.put(`${environment.apiUrl}/api/usuarios/${this.user.IdUsuario}`, this.user)
        .subscribe({
          next: () => {
            this.updateCurrentUserSession();
            this.snackBar.open('Usuario actualizado correctamente ✏️', 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            setTimeout(() => {
              this.router.navigate(['/client/userlist']);
            }, 1500);
          },
          error: (err) => {
            this.showValidationPopup(this.getErrorMessage(err, 'Error al actualizar usuario'));
          }
        });
      */

    } else {

      // 🔥 CREATE
      this.http.post(`${environment.apiUrl}/api/usuarios`, this.user)
        .subscribe({
          next: () => {
            this.snackBar.open('Usuario creado correctamente ✅', 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            setTimeout(() => {
              this.router.navigate(['/client/userlist']);
            }, 1500);
          },
          error: (err) => {
            this.showValidationPopup(this.getErrorMessage(err, 'Error al crear usuario'));
          }
        });
    }
  }

  updateUser() {
    this.http.put(`${environment.apiUrl}/api/usuarios/${this.user.IdUsuario}`, this.user)
      .subscribe({
        next: () => {
          this.updateCurrentUserSession();
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          setTimeout(() => {
            this.router.navigate(['/client/userlist']);
          }, 1500);
        },
        error: (err) => {
          this.showValidationPopup(this.getErrorMessage(err, 'Error al actualizar usuario'));
        }
      });
  }

  validateUser(): string | null {
    const nombre = String(this.user.Nombre || '').trim();
    const username = String(this.user.NombreUsuario || '').trim();
    const email = String(this.user.Email || '').trim();
    const password = String(this.user.Password || '');
    const telefono = String(this.user.Telefono || '').trim();

    if (!nombre) {
      return 'El nombre completo es obligatorio';
    }

    if (nombre.length < 2) {
      return 'El nombre completo debe tener al menos 2 caracteres';
    }

    if (!email) {
      return 'El correo electronico es obligatorio';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Ingresa un correo electronico valido';
    }

    if (!username) {
      return 'El nombre de usuario es obligatorio';
    }

    if (username.length < 4) {
      return 'El nombre de usuario debe tener al menos 4 caracteres';
    }

    if (!this.isEdit && !password) {
      return 'La contrasena es obligatoria';
    }

    if (password && password.length < 6) {
      return 'La contrasena debe tener al menos 6 caracteres';
    }

    if (!Number(this.user.IdRol)) {
      return 'Selecciona un rol para el usuario';
    }

    if (telefono && !/^[0-9+\-\s()]{7,20}$/.test(telefono)) {
      return 'Ingresa un telefono valido';
    }

    this.user.Nombre = nombre;
    this.user.NombreUsuario = username;
    this.user.Email = email;
    this.user.Telefono = telefono;

    return null;
  }

  getRoles() {
    this.http.get<any[]>(`${environment.apiUrl}/api/roles`)
      .subscribe({
        next: (res) => {
          this.roles = res;

          this.user.IdRol = Number(this.user.IdRol);

          console.log('Roles:', this.roles);
          console.log('Rol seleccionado:', this.user.IdRol);
        },
        error: (err) => {
          console.error('Error al cargar roles:', err);
          this.showValidationPopup('No se pudieron cargar los roles. Intenta nuevamente.');
        }
      });
  }

  //sidebar
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // =========================
  // PASSWORD VISIBILITY
  // =========================
  hide = true;

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showValidationPopup('Selecciona un archivo de imagen valido');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.showValidationPopup('La foto de perfil no debe superar 2 MB');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.user.FotoPerfil = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.user.FotoPerfil = '';
  }

  private updateCurrentUserSession() {
    const currentUser = this.auth.getUser();
    if (Number(currentUser?.id) !== Number(this.user.IdUsuario)) return;

    this.auth.updateStoredUser({
      nombre: this.user.Nombre,
      username: this.user.NombreUsuario,
      email: this.user.Email,
      rol: this.user.IdRol,
      fotoPerfil: this.user.FotoPerfil
    });
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
