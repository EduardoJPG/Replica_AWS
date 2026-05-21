import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common'; // ✅ IMPORTANTE (ngIf, ngFor)

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Footer } from '../../layout/footer/footer/footer';
import { Header } from '../../layout/header/header/header';
import { Menus } from '../../layout/header/menus/menus';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule, // 🔥 SOLUCIONA *ngIf, *ngFor
    Menus,
    Header,
    Footer,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './category.html',
  styleUrl: './category.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Category {

  // ✅ columnas alineadas con tu BD
  displayedColumns: string[] = [
    'nombre_categoria',
    'descripcion',
    'estado',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  // 🔹 FORMULARIO
  nombre_categoria: string = '';
  descripcion: string = '';
  estado: number = 1;

  // 🔹 TABLA
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    // 🔥 DATOS MOCK (simulando MySQL)
    this.dataSource.data = [
      {
        id_categoria: 1,
        nombre_categoria: 'Electrónica',
        descripcion: 'Dispositivos electrónicos',
        estado: 1
      },
      {
        id_categoria: 2,
        nombre_categoria: 'Ropa',
        descripcion: 'Prendas',
        estado: 0
      }
    ];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ✅ CREAR CATEGORÍA (simulación frontend)
  crearCategoria() {
    if (!this.nombre_categoria.trim()) return;

    const nueva = {
      id_categoria: Date.now(),
      nombre_categoria: this.nombre_categoria,
      descripcion: this.descripcion,
      estado: this.estado
    };

    this.dataSource.data = [...this.dataSource.data, nueva];

    // limpiar formulario
    this.nombre_categoria = '';
    this.descripcion = '';
    this.estado = 1;
  }

  // ✅ ELIMINAR
  eliminarCategoria(id: number) {
    this.dataSource.data =
      this.dataSource.data.filter(c => c.id_categoria !== id);
  }

  // 🔹 SIDEBAR
  menuSidebarActive: boolean = false;

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // 🔹 IMÁGENES (preview simple)
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;

  handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (!files) return;

    this.selectedItemCount += files.length;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.style.height = '60px';
        img.style.marginRight = '10px';

        this.imageContainer.nativeElement.appendChild(img);
      };

      reader.readAsDataURL(files[i]);
    }
  }
}