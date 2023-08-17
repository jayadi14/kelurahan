import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { BranchAddComponent } from './pages/branch-add/branch-add.component';
import { BranchListComponent } from './pages/branch-list/branch-list.component';
import { BranchViewComponent } from './pages/branch-view/branch-view.component';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { BranchAddDialogComponent } from './components/branch-add-dialog/branch-add-dialog.component';

@NgModule({
  declarations: [
    BranchComponent,
    BranchAddComponent,
    BranchViewComponent,
    BranchListComponent,
    BranchAddDialogComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    SharedModule,
    FcPaginationModule,
  ],
  exports: [
    BranchAddDialogComponent
  ]
})
export class BranchModule {}
