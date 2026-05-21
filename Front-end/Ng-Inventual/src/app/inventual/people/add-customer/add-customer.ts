import { Component, ViewEncapsulation } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
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
  ],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddCustomer {

  // sidebar
  menuSidebarActive: boolean = false;

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // ===== PROVEEDOR (según tu BD) =====
  nombre_proveedor: string = '';
  nit_ruc: string = '';
  telefono: string = '';
  email: string = '';
  direccion: string = '';
  pais: string = '';
  ciudad: string = '';
  compania: string = '';
  codigo_proveedor: string = '';
  estado: number = 1;

  // ===== CREATE (solo frontend por ahora) =====
  crearProveedor() {
    const proveedor = {
      nombre_proveedor: this.nombre_proveedor,
      nit_ruc: this.nit_ruc,
      telefono: this.telefono,
      email: this.email,
      direccion: this.direccion,
      pais: this.pais,
      ciudad: this.ciudad,
      compania: this.compania,
      codigo_proveedor: this.codigo_proveedor,
      estado: this.estado,
    };

    console.log('Proveedor creado:', proveedor);

    // limpiar formulario
    this.nombre_proveedor = '';
    this.nit_ruc = '';
    this.telefono = '';
    this.email = '';
    this.direccion = '';
    this.pais = '';
    this.ciudad = '';
    this.compania = '';
    this.codigo_proveedor = '';
    this.estado = 1;
  }
}