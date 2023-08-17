import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FcDialogComponent } from './fc-dialog.component';

@NgModule({
  declarations: [FcDialogComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    DialogModule,
    FormsModule,
    FontAwesomeModule,
  ],
  exports: [FcDialogComponent],
})
export class FcDialogModule {}
