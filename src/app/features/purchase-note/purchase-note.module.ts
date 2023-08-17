import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseNoteRoutingModule } from './purchase-note-routing.module';
import { PurchaseNoteComponent } from './purchase-note.component';
import { PurchaseNoteListComponent } from './pages/purchase-note-list/purchase-note-list.component';
import { PurchaseNoteAddComponent } from './pages/purchase-note-add/purchase-note-add.component';
import { PurchaseNoteViewComponent } from './pages/purchase-note-view/purchase-note-view.component';
import { SharedModule } from '@shared/shared.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { PurchaseNoteAddDetailComponent } from './components/purchase-note-add-detail/purchase-note-add-detail.component';
import { PurchaseNoteEditDetailComponent } from './components/purchase-note-edit-detail/purchase-note-edit-detail.component';


@NgModule({
  declarations: [
    PurchaseNoteComponent,
    PurchaseNoteListComponent,
    PurchaseNoteAddComponent,
    PurchaseNoteViewComponent,
    PurchaseNoteAddDetailComponent,
    PurchaseNoteEditDetailComponent
  ],
  imports: [
    CommonModule,
    PurchaseNoteRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcInputTextModule,
    FcInputNumberModule,
  ]
})
export class PurchaseNoteModule { }
