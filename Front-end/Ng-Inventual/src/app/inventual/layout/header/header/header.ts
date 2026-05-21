import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BellIcon } from '../../../icons/bell-icon/bell-icon';
import { EmailIcon } from '../../../icons/email-icon/email-icon';
import { GlobeIcon } from '../../../icons/globe-icon/globe-icon';
import { AuthService } from '../../../../services/auth.service';
import { AppLanguage, TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIcon, RouterModule, BellIcon, EmailIcon, GlobeIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  languages = [
    { code: 'ENG', name: 'English', locale: 'en' },
    { code: 'TUR', name: 'Turkish', locale: 'tr' },
    { code: 'ESP', name: 'Spanish', locale: 'es' },
    { code: 'FRA', name: 'French', locale: 'fr' },
  ];

  selectedLanguage = this.languages[0];
  defaultPhoto = 'assets/img/icon/header-profile.svg';

  get currentUser() {
    return this.authService.getUser();
  }

  get profilePhoto() {
    return this.currentUser?.fotoPerfil || this.defaultPhoto;
  }

  get displayName() {
    return this.currentUser?.nombre || this.currentUser?.username || 'Usuario';
  }

  get roleName() {
    return this.currentUser?.roleName || this.currentUser?.rol || 'Usuario';
  }

  //short menu activation start
  menuShortcutActive: boolean = false;
  shortmenu() {
    if (this.menuShortcutActive == false) {
      this.menuShortcutActive = true;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = false;
      this.langShortcutActive = false;
      this.proShortcutActive = false;
    } else {
      this.menuShortcutActive = false;
    }
  }
  //short menu activation end

  constructor(
    private authService: AuthService,
    private translationService: TranslationService
  ) {
    this.loadSelectedLanguage();
    this.translationService.language$.subscribe(language => {
      this.selectedLanguage = this.languages.find(item => item.locale === language) || this.languages[0];
    });
  }

  loadSelectedLanguage() {
    const savedLocale = this.translationService.currentLanguage;
    const savedLanguage = this.languages.find(language => language.locale === savedLocale);

    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    }

    document.documentElement.lang = this.selectedLanguage.locale;
  }

  //short menu activation start
  notifyShortcutActive: boolean = false;
  notifydropdown() {
    if (this.notifyShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = true;
      this.langShortcutActive = false;
      this.proShortcutActive = false;
    } else {
      this.notifyShortcutActive = false;
    }
  }
  //short menu activation end

  //short menu activation start
  emailShortcutActive: boolean = false;
  emaildropdown() {
    if (this.emailShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = true;
      this.notifyShortcutActive = false;
      this.langShortcutActive = false;
      this.proShortcutActive = false;
    } else {
      this.emailShortcutActive = false;
    }
  }
  //short menu activation end

  //short menu activation start
  langShortcutActive: boolean = false;
  langdropdown() {
    if (this.langShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = false;
      this.langShortcutActive = true;
      this.proShortcutActive = false;
    } else {
      this.langShortcutActive = false;
    }
  }
  //short menu activation end

  selectLanguage(language: { code: string; name: string; locale: string }, event: Event) {
    event.stopPropagation();
    this.selectedLanguage = language;
    this.langShortcutActive = false;
    this.translationService.setLanguage(language.locale as AppLanguage);
  }

  //short menu activation start
  proShortcutActive: boolean = false;
  prodropdown() {
    if (this.proShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = false;
      this.langShortcutActive = false;
      this.proShortcutActive = true;
    } else {
      this.proShortcutActive = false;
    }
  }

  logout() {
    this.authService.logout();
  }
  //short menu activation end
}
