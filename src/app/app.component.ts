import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FcDirtyStateService } from './core/service/fc-dirty-state.service';
import { DarkModeService } from './shared/services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'liszthoven-admin';
  darkMode: any;
  dirtyState: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private darkModeService: DarkModeService,
    private fcDirtyStateService: FcDirtyStateService
  ) {
    this.darkModeService.initialDarkMode();
    this.darkModeService.getDarkModeStatus.subscribe((darkMode) => {
      this.darkMode = darkMode;
      if (this.darkMode.isDark) {
        this.document.body.classList.add('dark');
      } else {
        this.document.body.classList.remove('dark');
      }
    });
    this.fcDirtyStateService.getCurrentState.subscribe(
      (state) => (this.dirtyState = state)
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.dirtyState) {
      event.preventDefault();

      // googlechrome need returnValue
      event.returnValue = true;
    }
  }
}
