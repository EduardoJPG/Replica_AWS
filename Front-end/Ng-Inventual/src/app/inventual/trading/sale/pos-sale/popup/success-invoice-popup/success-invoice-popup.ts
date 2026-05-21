import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PrinterIcon } from '../../../../../icons/printer-icon/printer-icon';
import { EmailIcon } from '../../../../../icons/email-icon/email-icon';

@Component({
  selector: 'app-success-invoice-popup',
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    PrinterIcon,
    EmailIcon,
  ],
  templateUrl: './success-invoice-popup.html',
  styleUrl: './success-invoice-popup.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SuccessInvoicePopup {}
