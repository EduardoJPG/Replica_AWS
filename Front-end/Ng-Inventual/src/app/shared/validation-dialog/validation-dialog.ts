import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-validation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './validation-dialog.html',
  styleUrl: './validation-dialog.scss',
})
export class ValidationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title?: string; message: string }) {}
}
