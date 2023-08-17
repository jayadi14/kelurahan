import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FcFilterDialogComponent } from './fc-filter-dialog.component';

@NgModule({
  declarations: [FcFilterDialogComponent],
  imports: [
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    FontAwesomeModule,
  ],
  exports: [FcFilterDialogComponent],
})
export class FcFilterDialogModule {}
