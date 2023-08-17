import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowRightFromBracket,
  faBell,
  faChevronLeft,
  faChevronUp,
  faDisplay,
  faGear,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();
  darkMode: any;
  faChevronUp = faChevronUp;
  faBell = faBell;
  faGear = faGear;
  faDisplay = faDisplay;
  faSun = faSun;
  faMoon = faMoon;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faChevronLeft = faChevronLeft;

  // get user info
  user: any;

  @Input() showSidebar: boolean = true;
  @Output() onToggleSidebar: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  mainMenus: any = [];

  constructor(
    private authService: AuthService,
    private darkModeService: DarkModeService,
    private layoutService: LayoutService,
    private router: Router
  ) {
    this.mainMenus = this.layoutService.getRoutes();
    this.darkModeService.getDarkModeStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe((darkMode) => {
        this.darkMode = darkMode;
      });

    this.authService.getCurrentUserData.subscribe((data: any) => {
      // console.log(data)
      this.user = data;
    });
  }

  showUserMenu: boolean = false;
  toggleSidebar() {
    this.onToggleSidebar.emit(!this.showSidebar);
  }

  ngOnInit(): void {
    this.checkActiveDropdownMenu();
  }
  checkActiveDropdownMenu() {
    const CUR_URL = this.router.url.split('/');
    this.mainMenus.map((mainMenu: any) => {
      if (mainMenu.parentRoute) {
        mainMenu.subMenus.forEach((subMenu: any) => {
          let route = subMenu.route.split('/')[1];
          if (CUR_URL.includes(route)) {
            mainMenu.showRoutes = true;
          }
        });
      }
    });
  }

  changeDarkMode(mode: string) {
    this.darkModeService.changeTo(mode);
  }
  logout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
