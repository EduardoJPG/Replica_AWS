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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
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
    MatSnackBarModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Profile {
  menuSidebarActive = false;
  isProfileEnabled = false;
  hide = true;
  defaultPhoto = 'assets/img/icon/header-profile.svg';

  user: any = {
    IdUsuario: 0,
    Nombre: '',
    NombreUsuario: '',
    Email: '',
    Password: '',
    IdRol: 0,
    Genero: '',
    Telefono: '',
    FotoPerfil: '',
    RoleName: ''
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const sessionUser = this.auth.getUser();
    const userId = Number(sessionUser?.id);

    if (!userId) {
      this.snackBar.open('No se encontro el usuario de la sesion', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/api/usuarios/${userId}`)
      .subscribe({
        next: (res) => {
          this.user = {
            IdUsuario: Number(res.id),
            Nombre: res.fullName || '',
            NombreUsuario: res.username || res.name || '',
            Email: res.email || '',
            Password: '',
            IdRol: Number(res.roleId || sessionUser?.rol || 0),
            Genero: res.genero || '',
            Telefono: res.phone || '',
            FotoPerfil: res.fotoPerfil || '',
            RoleName: res.role || sessionUser?.roleName || ''
          };
        },
        error: () => {
          this.user = {
            IdUsuario: userId,
            Nombre: sessionUser?.nombre || '',
            NombreUsuario: sessionUser?.username || '',
            Email: sessionUser?.email || '',
            Password: '',
            IdRol: Number(sessionUser?.rol || 0),
            Genero: sessionUser?.genero || '',
            Telefono: sessionUser?.telefono || '',
            FotoPerfil: sessionUser?.fotoPerfil || '',
            RoleName: sessionUser?.roleName || ''
          };
        }
      });
  }

  updateProfile(form: any) {
    if (!this.isProfileEnabled) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.http.put(`${environment.apiUrl}/api/usuarios/${this.user.IdUsuario}`, this.user)
      .subscribe({
        next: () => {
          this.auth.updateStoredUser({
            id: this.user.IdUsuario,
            nombre: this.user.Nombre,
            username: this.user.NombreUsuario,
            email: this.user.Email,
            rol: this.user.IdRol,
            roleName: this.user.RoleName,
            genero: this.user.Genero,
            telefono: this.user.Telefono,
            fotoPerfil: this.user.FotoPerfil
          });

          this.user.Password = '';
          this.isProfileEnabled = false;

          this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
        },
        error: () => {
          this.snackBar.open('Error al actualizar perfil', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.user.FotoPerfil = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.user.FotoPerfil = '';
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  editProfileEnable() {
    this.isProfileEnabled = !this.isProfileEnabled;
  }
}
