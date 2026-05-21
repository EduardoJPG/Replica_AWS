import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Login {

  hide = true;

  credentials = {
    username: '',
    password: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login() {
    this.auth.login(this.credentials).subscribe({
      next: (res: any) => {

        // 🔥 AQUÍ ESTÁ EL CAMBIO IMPORTANTE
        this.auth.saveSession(res);

        this.snackBar.open('Login exitoso ✅', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.snackBar.open('Credenciales incorrectas ❌', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}