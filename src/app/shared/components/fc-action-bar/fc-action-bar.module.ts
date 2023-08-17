import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FcActionBarComponent } from './fc-action-bar.component';

@NgModule({
  declarations: [FcActionBarComponent],
  imports: [CommonModule, FontAwesomeModule, RouterModule, OverlayPanelModule],
  exports: [FcActionBarComponent],
})
export class FcActionBarModule {}
