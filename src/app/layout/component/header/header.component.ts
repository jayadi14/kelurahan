import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { User } from '@features/staff/interfaces/staff';
import {
  faBars,
  faBell,
  faChevronDown,
  faChevronLeft,
  faCircleHalfStroke,
  faCircleNotch,
  faCog,
  faLineChart,
  faMoon,
  faPowerOff,
  faSearch,
  faSun,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { DarkModeService } from '@shared/services/dark-mode.service';
import { Subject, takeUntil } from 'rxjs';
import { HeaderConfig } from '../../interfaces/header-config.intercface';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private readonly destroy$ = new Subject<void>();

  faCircleNotch = faCircleNotch;
  faBars = faBars;
  faUser = faUser;
  faBell = faBell;
  faCircleHalfStroke = faCircleHalfStroke;
  faChevronDown = faChevronDown;
  faCog = faCog;
  faPowerOff = faPowerOff;
  faMoon = faMoon;
  faSun = faSun;
  faLineChart = faLineChart;
  faSearch = faSearch;
  faChevronLeft = faChevronLeft;

  darkMode: any;

  showThemes: boolean = false;
  showMenus: boolean = false;

  @Input() showSidebar: boolean = true;
  @Output() onToggleSidebar: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  headerConfig: HeaderConfig | null = null;
  searchConfig: any = {};

  menus: any = [];
  user: any = {} as User;
  notifications = [1, 2, 3, 4, 5];
  constructor(
    private layoutService: LayoutService,
    private darkModeService: DarkModeService,
    private router: Router,
    private authService: AuthService
  ) {
    this.menus = this.layoutService.getRoutes();
    this.layoutService.headerConfigSubject.subscribe((config) => {
      this.headerConfig = config;
    });
    this.layoutService.searchConfigSubject.subscribe((config) => {
      this.searchConfig = config;
    });
    this.darkModeService.getDarkModeStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe((darkMode) => {
        this.darkMode = darkMode;
      });
    this.authService.currentUserDataSubject.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  toggleSidebar() {
    this.onToggleSidebar.emit(!this.showSidebar);
  }
  onSearch() {
    this.layoutService.setSearchConfig({
      searchQuery: this.searchConfig.searchQuery,
    });
  }
  onSearchEnter() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      return this.router.navigate([this.searchConfig.baseHref], {
        queryParams: {
          page: 1,
          limit: 10,
          searchQuery: this.searchConfig.searchQuery,
        },
      });
    });
  }
  changeDarkMode(mode: string) {
    this.darkModeService.changeTo(mode);
  }
  logout() {
    this.authService.logout();
  }
}
