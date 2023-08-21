import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderConfig } from '../interfaces/header-config.intercface';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isMobileSubject: BehaviorSubject<any>;

  headerConfigSubject = new BehaviorSubject<HeaderConfig>({
    title: '',
    icon: '',
    showHeader: true,
  });
  searchConfigSubject = new BehaviorSubject<any>({
    showSearch: false,
    searchPlaceholder: '',
    searchQuery: '',
    featureName: '',
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isMobileSubject = new BehaviorSubject(
      Boolean(this.deviceType == 'mobile')
    );
  }
  get deviceType(): string {
    if (isPlatformBrowser(this.platformId)) {
      const ua = window.navigator.userAgent;
      if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          ua
        )
      ) {
        return 'mobile';
      }
      return 'desktop';
    } else {
      return '';
    }
  }
  public get isMobile$() {
    return this.isMobileSubject;
  }

  setHeaderConfig(config: HeaderConfig) {
    this.headerConfigSubject.next({
      ...this.headerConfigSubject.value,
      ...config,
    });
  }
  setSearchConfig(config: any) {
    this.searchConfigSubject.next({
      ...this.searchConfigSubject.value,
      ...config,
    });
  }
  getRoutes() {
    return [
      {
        route: '/users',
        name: 'Pengguna',
      },
    ];
  }
}
