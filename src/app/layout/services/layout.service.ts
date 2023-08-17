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
        route: '/currency',
        name: 'Currency',
      },
      {
        route: '/branch',
        name: 'Branch',
      },
      {
        route: '/company',
        name: 'Company',
      },
      {
        route: '/customer',
        name: 'Customer',
      },
      {
        route: '/staff',
        name: 'Staff',
      },
      {
        route: '/brand',
        name: 'Brand',
      },
      {
        route: '/supplier',
        name: 'Supplier',
      },
      {
        name: 'Purchase',
        parentRoute: 'purchase',
        showRoutes: false,
        subMenus: [
          {
            name: 'Purchase Request',
            route: '/purchase-request',
          },
          {
            name: 'Supplier Quotation',
            route: '/supplier-quotation',
          },
          {
            name: 'Purchase Order',
            route: '/purchase-order',
          },
          { name: 'Purchase Invoice', route: '/purchase-invoice' },
          { name: 'Goods Receipt', route: '/goods-receipt' },
          { name: 'Purchase Payment', route: '/purchase-payment' },
          { name: 'Purchase Return', route: '/purchase-return' },
          { name: 'Purchase Note', route: '/purchase-note' },
        ],
      },
      {
        name: 'Sales',
        parentRoute: 'purchase',
        showRoutes: false,
        subMenus: [
          { name: 'Sales Invoice', route: '/sale-invoice' },
          {
            name: 'Sales Order',
            route: '/sale-order',
          },
        ],
      },
      {
        route: '/expense',
        name: 'Expense',
      },
      {
        name: 'Product',
        parentRoute: 'report',
        showRoutes: false,
        subMenus: [
          { name: 'Product List', route: '/product' },
          { name: 'Product Stock Movement', route: '/stock-movement' },
          {
            name: 'Product Category',
            route: '/product-category',
          },
        ],
      },
      {
        route: '/warehouse',
        name: 'Warehouse',
      },

      {
        route: '/chart-of-account',
        name: 'Chart of Accounts',
      },
    ];
  }
}
