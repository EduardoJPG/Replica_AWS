import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { Menus } from '../../layout/header/menus/menus';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-email-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    Header,
    Footer,
    Menus,
  ],
  templateUrl: './email-settings.html',
  styleUrl: './email-settings.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmailSettings implements OnInit {
  menuSidebarActive = false;
  isSaving = false;
  isSendingTest = false;
  testEmail = '';
  emailConfig = {
    smtpHost: '',
    smtpPort: 587,
    useSsl: true,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadConfig();
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  closeSidebar() {
    if (this.menuSidebarActive) {
      this.menuSidebarActive = false;
    }
  }

  loadConfig() {
    this.http.get<any>(`${environment.apiUrl}/api/email/configuracion`).subscribe({
      next: (config) => {
        this.emailConfig = {
          smtpHost: config.smtpHost || '',
          smtpPort: Number(config.smtpPort) || 587,
          useSsl: config.useSsl ?? true,
          username: config.username || '',
          password: '',
          fromEmail: config.fromEmail || '',
          fromName: config.fromName || '',
        };
      },
      error: () => this.showMessage('No se pudo cargar la configuracion de correo'),
    });
  }

  saveConfig() {
    this.isSaving = true;
    this.http.put<any>(`${environment.apiUrl}/api/email/configuracion`, this.emailConfig).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showMessage(res?.message || 'Configuracion guardada');
      },
      error: (err) => {
        this.isSaving = false;
        this.showMessage(err?.error?.message || 'No se pudo guardar la configuracion');
      },
    });
  }

  sendTestEmail() {
    if (!this.testEmail.trim()) {
      this.showMessage('Ingresa el correo de prueba');
      return;
    }

    this.isSendingTest = true;
    this.http.post<any>(`${environment.apiUrl}/api/email/test`, { testEmail: this.testEmail }).subscribe({
      next: (res) => {
        this.isSendingTest = false;
        this.showMessage(res?.message || 'Correo de prueba enviado');
      },
      error: (err) => {
        this.isSendingTest = false;
        this.showMessage(err?.error?.message || 'No se pudo enviar el correo de prueba');
      },
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
