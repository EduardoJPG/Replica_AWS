import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../../../../services/translation.service';

@Component({
  selector: 'app-view-adjustment',
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './view-adjustment.html',
  styleUrl: './view-adjustment.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ViewAdjustment {
  constructor(
    @Inject(MAT_DIALOG_DATA) public adjustment: any,
    public translationService: TranslationService
  ) {}
}
