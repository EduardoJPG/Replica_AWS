import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface Permiso {
  nombre: string;
  puede_ver: boolean;
  puede_crear: boolean;
  puede_editar: boolean;
  puede_eliminar: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = `${environment.apiUrl}/api/auth`;
  private timeoutTime = 15 * 60 * 1000; // 15 minutos

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: any) {
    return this.http.post(`${this.api}/login`, credentials);
  }

  saveSession(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('permisos', JSON.stringify(response.permisos));
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  updateStoredUser(changes: any) {
    const currentUser = this.getUser();
    if (!currentUser) return;

    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      ...changes
    }));
  }

  getPermisos(): Permiso[] {
    const permisos = localStorage.getItem('permisos');
    return permisos ? JSON.parse(permisos) : [];
  }

  hasPermission(
    nombre: string,
    accion: 'puede_ver' | 'puede_crear' | 'puede_editar' | 'puede_eliminar'
  ): boolean {
    const permisos = this.getPermisos();

    const permiso = permisos.find((p: any) =>
      p.nombre?.toLowerCase() === nombre.toLowerCase()
    );

    return permiso ? permiso[accion] === true : false;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  updateActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  isSessionExpired(): boolean {
    const lastActivity = localStorage.getItem('lastActivity');

    if (!lastActivity) {
      return true;
    }

    const now = Date.now();
    const last = Number(lastActivity);

    return now - last > this.timeoutTime;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permisos');
    localStorage.removeItem('lastActivity');

    this.router.navigate(['/'], { replaceUrl: true });
  }
}
