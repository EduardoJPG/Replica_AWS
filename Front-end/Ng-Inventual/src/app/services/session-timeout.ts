import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {

  private timeoutId: any;
  private readonly timeoutTime = 15 * 60 * 1000;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  startWatching() {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach(eventName => {
      window.addEventListener(eventName, () => {
        if (this.authService.isLoggedIn()) {
          this.authService.updateActivity();
          this.resetTimer();
        }
      });
    });

    this.resetTimer();
  }

  resetTimer() {
    clearTimeout(this.timeoutId);

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          if (this.authService.isLoggedIn()) {
            this.authService.logout();
          }
        });
      }, this.timeoutTime);
    });
  }
}