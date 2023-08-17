import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch.component';
import { BranchAddComponent } from './pages/branch-add/branch-add.component';
import { BranchListComponent } from './pages/branch-list/branch-list.component';
import { BranchViewComponent } from './pages/branch-view/branch-view.component';

const routes: Routes = [
  {
    path: '',
    component: BranchComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: BranchListComponent,
      },
      {
        path: 'add',
        component: BranchAddComponent,
      },
      {
        path: 'view/:id',
        component: BranchViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchRoutingModule {}
