import { Component, ViewEncapsulation } from '@angular/core';
import { DownloadIcon } from '../../icons/download-icon/download-icon';
import { TrashIcon } from '../../icons/trash-icon/trash-icon';
import { StarIcon } from '../../icons/star-icon/star-icon';
import { ArrowIcon } from '../../icons/arrow-icon/arrow-icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-message',
  imports: [
    DownloadIcon,
    TrashIcon,
    StarIcon,
    ArrowIcon,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './message.html',
  styleUrl: './message.scss',
  encapsulation: ViewEncapsulation.None
})
export class Message {}
