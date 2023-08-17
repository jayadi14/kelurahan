import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  darkModeStatus: BehaviorSubject<any>;
  constructor() {
    this.darkModeStatus = new BehaviorSubject(
      JSON.parse(localStorage.getItem('darkMode') as any)
    );
  }

  public get getDarkModeStatus() {
    return this.darkModeStatus;
  }

  initialDarkMode() {
    let darkMode = localStorage.getItem('darkMode');
    if (!darkMode) {
      localStorage.setItem(
        'darkMode',
        JSON.stringify({
          mode: 'theme',
          isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
        })
      );
      this.darkModeStatus.next({
        mode: 'system',
        isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      });
    }
  }
  changeTo(mode: string) {
    switch (mode) {
      case 'light':
        localStorage.setItem(
          'darkMode',
          JSON.stringify({ mode: 'theme', isDark: false })
        );
        this.darkModeStatus.next({ mode: 'theme', isDark: false });
        break;
      case 'dark':
        localStorage.setItem(
          'darkMode',
          JSON.stringify({ mode: 'theme', isDark: true })
        );
        this.darkModeStatus.next({ mode: 'theme', isDark: true });
        break;
      case 'system':
        localStorage.setItem(
          'darkMode',
          JSON.stringify({
            mode: 'system',
            isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
          })
        );
        this.darkModeStatus.next({
          mode: 'system',
          isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
        });
        break;
      default:
        break;
    }
  }
}
