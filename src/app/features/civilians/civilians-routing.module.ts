import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CiviliansComponent } from './civilians.component';
import { CiviliansListComponent } from './pages/civilians-list/civilians-list.component';
import { CiviliansViewComponent } from './pages/civilians-view/civilians-view.component';

const routes: Routes = [
  {
    path: '',
    component: CiviliansComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CiviliansListComponent,
      },
      {
        path: 'view/:id',
        component: CiviliansViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CiviliansRoutingModule {}
