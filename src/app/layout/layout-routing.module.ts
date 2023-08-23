import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
      {
        path: 'civilians',
        loadChildren: () =>
          import('../features/civilians/civilians.module').then(
            (m) => m.CiviliansModule
          ),
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('../features/staff/staff.module').then((m) => m.StaffModule),
      },
      {
        path: 'document-submission',
        loadChildren: () =>
          import('../features/document-submission/document-submission.module').then((m) => m.DocumentSubmissionModule),
      },
      {
        path: 'template-ui',
        loadChildren: () =>
          import('../features/template-ui/template-ui.module').then(
            (m) => m.TemplateUiModule
          ),
      },

      {
        path: 'user-profile',
        loadChildren: () =>
          import('../features/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
