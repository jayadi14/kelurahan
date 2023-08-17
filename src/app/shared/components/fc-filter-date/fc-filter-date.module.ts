import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FcFilterDateComponent } from './fc-filter-date.component';

@NgModule({
  declarations: [FcFilterDateComponent],
  imports: [
    CommonModule,
    CalendarModule,
    OverlayPanelModule,
    FormsModule,
    FontAwesomeModule,
  ],
  exports: [FcFilterDateComponent],
})
export class FcFilterDateModule {}
