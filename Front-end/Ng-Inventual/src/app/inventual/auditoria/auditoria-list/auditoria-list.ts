import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Footer } from '../../layout/footer/footer/footer';
import { Header } from '../../layout/header/header/header';
import { Menus } from '../../layout/header/menus/menus';
import { environment } from '../../../../environments/environment';

interface AuditLog {
  idLog: number;
  fechaUtc: string;
  idUsuario?: number | null;
  nombreUsuario?: string | null;
  accion: string;
  modulo: string;
  entidadId?: string | null;
  metodo: string;
  ruta: string;
  estadoHttp: number;
  ip?: string | null;
  userAgent?: string | null;
  detalle?: string | null;
}

@Component({
  selector: 'app-auditoria-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Menus,
    Header,
    Footer,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule
  ],
  templateUrl: './auditoria-list.html',
  styleUrl: './auditoria-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuditoriaList implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'fecha',
    'usuario',
    'accion',
    'modulo',
    'metodo',
    'ruta',
    'estado',
    'ip',
    'detalle'
  ];

  dataSource = new MatTableDataSource<AuditLog>([]);
  categorias: string[] = [];
  acciones = ['Login', 'Login fallido', 'Crear', 'Actualizar', 'Eliminar', 'Activar', 'Desactivar', 'Importar', 'Intento fallido'];
  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    modulo: '',
    accion: '',
    idUsuario: ''
  };
  pageSize = 10;
  pageSizeOptions = [10, 25, 100];
  loading = false;
  menuSidebarActive = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.configureFilter();
    this.getCategorias();
    this.getLogs();
  }

  ngAfterViewInit() {
    this.bindTableControls();
  }

  getLogs() {
    this.loading = true;
    let params = new HttpParams().set('limit', '500');

    Object.entries(this.filtros).forEach(([key, value]) => {
      if (String(value || '').trim()) {
        params = params.set(key, String(value).trim());
      }
    });

    this.http.get<AuditLog[]>(`${environment.apiUrl}/api/auditoria`, { params })
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.bindTableControls();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar auditoria:', err);
          this.loading = false;
          this.snackBar.open('No se pudieron cargar los logs de auditoria', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  getCategorias() {
    this.http.get<string[]>(`${environment.apiUrl}/api/auditoria/categorias`)
      .subscribe({
        next: (res) => {
          this.categorias = res;
        },
        error: (err) => {
          console.error('Error al cargar categorias de auditoria:', err);
        }
      });
  }

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilters() {
    this.getLogs();
  }

  clearFilters(input?: HTMLInputElement) {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: '',
      modulo: '',
      accion: '',
      idUsuario: ''
    };

    if (input) {
      input.value = '';
    }

    this.dataSource.filter = '';
    this.getLogs();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.bindTableControls();
  }

  formatDate(value: string) {
    if (!value) {
      return '';
    }

    const utcValue = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`;
    return new Date(utcValue).toLocaleString();
  }

  getStatusClass(status: number) {
    return status >= 400 ? 'audit-status-error' : 'audit-status-success';
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  private configureFilter() {
    this.dataSource.filterPredicate = (log: AuditLog, filter: string) => {
      const values = [
        log.nombreUsuario,
        log.accion,
        log.modulo,
        log.metodo,
        log.ruta,
        log.estadoHttp,
        log.ip,
        log.detalle
      ];

      return values.some(value => String(value ?? '').toLowerCase().includes(filter));
    };
  }

  private bindTableControls() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
