import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentSubmissionRoutingModule } from './document-submission-routing.module';
import { DocumentSubmissionComponent } from './document-submission.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { DocumentSubmissionListComponent } from './pages/document-submission-list/document-submission-list.component';
import { DocumentSubmissionViewComponent } from './pages/document-submission-view/document-submission-view.component';
import { DocumentSubmissionAddComponent } from './pages/document-submission-add/document-submission-add.component';


@NgModule({
  declarations: [
    DocumentSubmissionComponent,
    DocumentSubmissionListComponent,
    DocumentSubmissionViewComponent,
    DocumentSubmissionAddComponent
  ],
  imports: [
    CommonModule,
    DocumentSubmissionRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcInputTextModule,
    FcDropdownModule,
    FcDatepickerModule,
  ]
})
export class DocumentSubmissionModule { }
