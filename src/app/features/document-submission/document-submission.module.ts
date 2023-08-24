import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcFileInputModule } from '@shared/components/fc-file-input/fc-file-input.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentSubmissionRoutingModule } from './document-submission-routing.module';
import { DocumentSubmissionComponent } from './document-submission.component';
import { DocumentSubmissionAddComponent } from './pages/document-submission-add/document-submission-add.component';
import { DocumentSubmissionListComponent } from './pages/document-submission-list/document-submission-list.component';
import { DocumentSubmissionViewComponent } from './pages/document-submission-view/document-submission-view.component';

@NgModule({
  declarations: [
    DocumentSubmissionComponent,
    DocumentSubmissionListComponent,
    DocumentSubmissionViewComponent,
    DocumentSubmissionAddComponent,
  ],
  imports: [
    CommonModule,
    DocumentSubmissionRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcInputTextModule,
    FcDropdownModule,
    FcDatepickerModule,
    FcFileInputModule,
  ],
})
export class DocumentSubmissionModule {}
