import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyAddComponent } from './pages/company-add/company-add.component';
import { CompanyViewComponent } from './pages/company-view/company-view.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CompanyListComponent,
      },
      {
        path: 'add',
        component: CompanyAddComponent,
      },
      {
        path: 'view/:id',
        component: CompanyViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
