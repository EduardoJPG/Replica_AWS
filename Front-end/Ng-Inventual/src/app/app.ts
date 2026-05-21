import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventualModule } from './inventual/inventual-module';

import { SessionTimeoutService } from './services/session-timeout';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    InventualModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements AfterViewInit {

  protected title = 'inventual-angular';

  isRTL = false;
  isSettingsAreaActive = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private translationService: TranslationService,
    private sessionTimeout: SessionTimeoutService // 👈 NUEVO
  ) {}

  ngOnInit() {
    const storedDirection = localStorage.getItem('direction');
    this.isRTL = storedDirection === 'rtl';

    this.setDocumentDirection();

    // 🔥 INICIAR CONTROL DE INACTIVIDAD
    this.sessionTimeout.startWatching();
  }

  toggleSettingsArea() {
    this.isSettingsAreaActive = !this.isSettingsAreaActive;
  }

  ngAfterViewInit() {
    this.translationService.start(this.el.nativeElement.ownerDocument.body);
  }

  setDirection(direction: 'rtl' | 'ltr') {
    this.isRTL = direction === 'rtl';
    localStorage.setItem('direction', this.isRTL ? 'rtl' : 'ltr');
    this.setDocumentDirection();
  }

  private setDocumentDirection() {
    const direction = this.isRTL ? 'rtl' : 'ltr';

    this.renderer.setAttribute(
      this.el.nativeElement.ownerDocument.documentElement,
      'dir',
      direction
    );
  }
}
