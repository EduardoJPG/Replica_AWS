import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-view-payment',
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './view-payment.html',
  styleUrl: './view-payment.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ViewPayment {
  constructor(@Inject(MAT_DIALOG_DATA) public sale: any) {}
}
