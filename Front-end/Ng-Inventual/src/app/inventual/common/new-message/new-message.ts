import { Component, ViewEncapsulation } from '@angular/core';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-message',
  imports: [
    Menus,
    Header,
    Footer,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './new-message.html',
  styleUrl: './new-message.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NewMessage {
  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    } else {
      this.menuSidebarActive = false;
    }
  }
  //sidebar menu activation end
}
