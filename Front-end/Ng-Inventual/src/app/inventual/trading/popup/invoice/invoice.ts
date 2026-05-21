import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PrinterIcon } from '../../../icons/printer-icon/printer-icon';
import { EmailIcon } from '../../../icons/email-icon/email-icon';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-invoice',
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    PrinterIcon,
    EmailIcon,
  ],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Invoice {
  sale: any;
  isSendingEmail = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.sale = data || {};
  }

  get details(): any[] {
    return this.sale.detalles || [];
  }

  get paidAmount(): number {
    const payment = String(this.sale.estadoPago || this.sale.payment || '').toLowerCase();
    return payment.includes('pagado') || payment.includes('paid') ? Number(this.sale.total) || 0 : 0;
  }

  get dueAmount(): number {
    return (Number(this.sale.total) || 0) - this.paidAmount;
  }

  printInvoice() {
    window.print();
  }

  emailInvoice() {
    const toEmail = window.prompt('Correo destino para enviar la factura');
    if (!toEmail?.trim()) {
      return;
    }

    const saleId = this.sale.idVenta || this.sale.id;
    this.isSendingEmail = true;
    this.http.post<any>(`${environment.apiUrl}/api/email/factura/${saleId}`, { toEmail }).subscribe({
      next: (res) => {
        this.isSendingEmail = false;
        this.showMessage(res?.message || 'Factura enviada');
      },
      error: (err) => {
        this.isSendingEmail = false;
        this.showMessage(err?.error?.message || 'No se pudo enviar la factura');
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
