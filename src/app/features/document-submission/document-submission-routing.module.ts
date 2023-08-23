import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentSubmissionComponent } from './document-submission.component';
import { DocumentSubmissionListComponent } from './pages/document-submission-list/document-submission-list.component';
import { DocumentSubmissionViewComponent } from './pages/document-submission-view/document-submission-view.component';
import { DocumentSubmissionAddComponent } from './pages/document-submission-add/document-submission-add.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentSubmissionComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: DocumentSubmissionListComponent,
      },
      {
        path: 'add',
        component: DocumentSubmissionAddComponent,
      },
      {
        path: 'view/:id',
        component: DocumentSubmissionViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentSubmissionRoutingModule { }
