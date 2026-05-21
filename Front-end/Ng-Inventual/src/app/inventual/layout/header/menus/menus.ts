import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { navbarData } from './nav-data';
import { fadeInOut, INavbarData } from './helper';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { TranslationService } from '../../../../services/translation.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-menus',
  imports: [SublevelMenuComponent, CommonModule, RouterModule],
  templateUrl: './menus.html',
  styleUrl: './menus.scss',
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class Menus implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData: INavbarData[] = [];
  multiple: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.navData = this.filterMenuByPermissions(navbarData);
  }

  private filterMenuByPermissions(items: INavbarData[]): INavbarData[] {
    return items
      .map((item: any) => {
        const filteredChildren = item.items
          ? this.filterMenuByPermissions(item.items)
          : undefined;

        const hasChildren = filteredChildren && filteredChildren.length > 0;

        const hasPermission =
          item.permission &&
          this.authService.hasPermission(item.permission, 'puede_ver');

        if (hasPermission || hasChildren) {
          return {
            ...item,
            items: filteredChildren
          };
        }

        return null;
      })
      .filter((item: INavbarData | null) => item !== null) as INavbarData[];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
