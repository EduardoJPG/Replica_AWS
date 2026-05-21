import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTab, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header/header';
import { Menus } from '../../layout/header/menus/menus';
import { Footer } from '../../layout/footer/footer/footer';
import { Message } from '../message/message';
import { MessageDraft } from '../message-draft/message-draft';
import { MessageSent } from '../message-sent/message-sent';
import { MessageTrash } from '../message-trash/message-trash';

@Component({
  selector: 'app-message-inbox',
  imports: [
    Header,
    Menus,
    Footer,
    Message,
    MessageDraft,
    MessageSent,
    MessageTrash,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './message-inbox.html',
  styleUrl: './message-inbox.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MessageInbox {
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
