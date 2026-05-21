import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotFound {

}
