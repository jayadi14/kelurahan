import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcFileInputModule } from '@shared/components/fc-file-input/fc-file-input.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CiviliansRoutingModule } from './civilians-routing.module';
import { CiviliansComponent } from './civilians.component';
import { CiviliansApprovalNoteDialogComponent } from './components/civilians-approval-note-dialog/civilians-approval-note-dialog.component';
import { CiviliansListComponent } from './pages/civilians-list/civilians-list.component';
import { CiviliansViewComponent } from './pages/civilians-view/civilians-view.component';

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
    FcFileInputModule,
  ],
})
export class CiviliansModule {}
