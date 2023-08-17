import { Component, OnInit } from '@angular/core';
import {
  faArrowRightFromBracket,
  faBell,
  faBoxOpen,
  faCoins,
  faDisplay,
  faEnvelope,
  faMoon,
  faReceipt,
  faShirt,
  faSun,
  faTachometerAlt,
  faUser,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'fc-mobile-navigation',
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.css'],
})
export class MobileNavigationComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();
  faTachometerAlt = faTachometerAlt;
  faShirt = faShirt;
  faReceipt = faReceipt;
  faWallet = faWallet;
  faUser = faUser;
  faCoins = faCoins;
  faBoxOpen = faBoxOpen;
  faEnvelope = faEnvelope;
  faMoon = faMoon;
  faDisplay = faDisplay;
  faSun = faSun;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faBell = faBell;
  showDrawer: boolean = false;

  user: any;
  darkMode: any;

  mainMenus: any = [];
  categoryMenus: any = [];

  constructor(
    private authService: AuthService,
    private darkModeService: DarkModeService,
    private layoutService: LayoutService
  ) {
    this.mainMenus = this.layoutService.getRoutes();
    this.darkModeService.getDarkModeStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe((darkMode) => {
        this.darkMode = darkMode;
      });
    this.authService.getCurrentUserData.subscribe((data: any) => {
      this.user = data;
    });
  }
  ngOnInit(): void {}

  changeDarkMode(mode: string) {
    this.darkModeService.changeTo(mode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  logout() {
    this.authService.logout();
  }
}
