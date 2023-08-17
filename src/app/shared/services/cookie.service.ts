import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@env';
import { BehaviorSubject } from 'rxjs';

const API_URL = environment.API_URL;
@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  setCookie(name: any, expiredTime: any) {
    const d = new Date();
    d.setTime(d.getTime() + expiredTime * 60 * 1000); // minutes expired
    let expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + name + ';' + expires + ';path=/';
  }

  isCookieExists(name: string): boolean {
    const cookieName = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName)) {
        return true;
      }
    }
    return false;
  }

  getCookie(cname: string) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  removeLocalStorageData(name: any) {
    localStorage.removeItem(name);
  }

  getLocalStorageData(name: any) {
    const data = localStorage.getItem(name);
    return data;
  }
}
