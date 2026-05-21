import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SuccessInvoicePopup } from '../success-invoice-popup/success-invoice-popup';

@Component({
  selector: 'app-success-popup',
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './success-popup.html',
  styleUrl: './success-popup.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SuccessPopup {
  constructor(public dialog: MatDialog) {}
  invoice() {
    this.dialog.open(SuccessInvoicePopup);
  }
}
