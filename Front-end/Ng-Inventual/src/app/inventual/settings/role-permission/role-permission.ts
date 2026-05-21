import { Component, ViewEncapsulation } from '@angular/core';
import { Menus } from '../../layout/header/menus/menus';
import { Header } from '../../layout/header/header/header';
import { Footer } from '../../layout/footer/footer/footer';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductPermission } from '../product-permission/product-permission';
import { TradingPermission } from '../trading-permission/trading-permission';
import { ExpensePermission } from '../expense-permission/expense-permission';
import { WarehousePermission } from '../warehouse-permission/warehouse-permission';
import { PeoplePermission } from '../people-permission/people-permission';
import { ReportPermission } from '../report-permission/report-permission';
import { SystemPermission } from '../system-permission/system-permission';

//for checkbox
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-role-permission',
  imports: [
    Menus,
    Header,
    Footer,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ProductPermission,
    TradingPermission,
    ExpensePermission,
    WarehousePermission,
    PeoplePermission,
    ReportPermission,
    SystemPermission,
  ],
  templateUrl: './role-permission.html',
  styleUrl: './role-permission.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RolePermission {
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
