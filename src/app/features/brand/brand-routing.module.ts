import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './brand.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { BrandListComponent } from './pages/brand-list/brand-list.component';
import { BrandViewComponent } from './pages/brand-view/brand-view.component';

const routes: Routes = [
  {
    path: '',
    component: BrandComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: BrandListComponent,
      },
      {
        path: 'add',
        component: BrandAddComponent,
      },
      {
        path: 'view/:id',
        component: BrandViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandRoutingModule {}
