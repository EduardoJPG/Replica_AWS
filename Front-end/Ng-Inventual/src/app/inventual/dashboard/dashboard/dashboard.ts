import { Component, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Supplier } from '../supplier/supplier';
import { Topseller } from '../topseller/topseller';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Quickview } from '../quickview/quickview';
import { Linechart } from '../charts/linechart/linechart';
import { Barchart } from '../charts/barchart/barchart';
import { Piechart } from '../charts/piechart/piechart';
import { Transaction } from '../transaction/transaction';
import { User } from '../user/user';
import { Calender } from '../calender/calender';
import { Footer } from '../../layout/footer/footer/footer';

@Component({
  selector: 'app-dashboard',
  imports: [MatIcon, Supplier, Topseller, Menus, Header, Quickview, Linechart, Barchart, Piechart, Transaction, User, Calender, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Dashboard {
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
