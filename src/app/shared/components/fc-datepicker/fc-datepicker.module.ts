import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FcDatepickerComponent } from './fc-datepicker.component';

@NgModule({
  declarations: [FcDatepickerComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    OverlayPanelModule,
    FormsModule,
    CalendarModule,
  ],
  exports: [FcDatepickerComponent],
})
export class FcDatepickerModule {}
