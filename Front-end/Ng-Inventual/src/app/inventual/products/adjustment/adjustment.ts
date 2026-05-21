import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewAdjustment } from './popup/view-adjustment/view-adjustment';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrinterIcon } from '../../icons/printer-icon/printer-icon';
import { PdfIcon } from '../../icons/pdf-icon/pdf-icon';
import { CsvIcon } from '../../icons/csv-icon/csv-icon';
import { FilterIcon } from '../../icons/filter-icon/filter-icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-adjustment',
  imports: [
    Menus,
    Header,
    Footer,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    PrinterIcon,
    PdfIcon,
    CsvIcon,
    FilterIcon,
    RouterModule
  ],
  templateUrl: './adjustment.html',
  styleUrl: './adjustment.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Adjustment implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'id',
    'referencia',
    'fecha',
    'warehouse',
    'remarks',
    'items',
    'type',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  pageSize = 10;
  pageSizeOptions = [10, 25, 100];
  menuSidebarActive = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public auth: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.configureSearch();
    this.getAdjustments();
  }

  ngAfterViewInit() {
    this.bindTableControls();
  }

  configureSearch() {
    this.dataSource.filterPredicate = (row: any, filter: string) => {
      const term = filter.trim().toLowerCase();
      return [
        row.referencia,
        row.bodega,
        row.warehouse,
        row.observaciones,
        row.remarks,
        row.type
      ].some(value => String(value ?? '').toLowerCase().includes(term));
    };
  }

  getAdjustments() {
    this.http.get<any[]>(`${environment.apiUrl}/api/ajustes`)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.selection.clear();
          this.bindTableControls();
        },
        error: () => {
          this.snackBar.open('Error al cargar ajustes', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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
    return this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  viewAdjustment(row: any) {
    this.http.get<any>(`${environment.apiUrl}/api/ajustes/${row.idAjuste || row.id}`)
      .subscribe({
        next: (adjustment) => {
          this.dialog.open(ViewAdjustment, {
            width: '860px',
            data: adjustment
          });
        },
        error: () => {
          this.snackBar.open('No se pudo cargar el detalle del ajuste', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  deleteAdjustment(row: any) {
    if (!this.auth.hasPermission('Ajustes', 'puede_eliminar')) {
      this.snackBar.open('No tienes permiso para desactivar ajustes', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Seguro que deseas desactivar este ajuste?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.http.delete(`${environment.apiUrl}/api/ajustes/${row.idAjuste || row.id}`)
        .subscribe({
          next: () => {
            this.snackBar.open('Ajuste desactivado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.getAdjustments();
          },
          error: () => {
            this.snackBar.open('Error al desactivar ajuste', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    });
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
