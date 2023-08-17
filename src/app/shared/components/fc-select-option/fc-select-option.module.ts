import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FcDialogModule } from '../fc-dialog/fc-dialog.module';
import { FcPaginationModule } from '../fc-pagination/fc-pagination.module';
import { FcSelectOptionComponent } from './fc-select-option.component';

@NgModule({
  declarations: [FcSelectOptionComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    DialogModule,
    FontAwesomeModule,
    InputTextModule,
    FcPaginationModule,
    FormsModule,
    FcDialogModule,
  ],
  exports: [FcSelectOptionComponent],
})
export class FcSelectOptionModule {}
