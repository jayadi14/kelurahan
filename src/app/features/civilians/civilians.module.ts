import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CiviliansRoutingModule } from './civilians-routing.module';
import { CiviliansComponent } from './civilians.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { CiviliansListComponent } from './pages/civilians-list/civilians-list.component';
import { CiviliansViewComponent } from './pages/civilians-view/civilians-view.component';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { CiviliansApprovalNoteDialogComponent } from './components/civilians-approval-note-dialog/civilians-approval-note-dialog.component';

@NgModule({
  declarations: [
    CiviliansComponent,
    CiviliansListComponent,
    CiviliansViewComponent,
    CiviliansApprovalNoteDialogComponent,
  ],
  imports: [
    CommonModule,
    CiviliansRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcInputTextModule,
    FcDropdownModule,
    FcDatepickerModule,
  ],
})
export class CiviliansModule {}
