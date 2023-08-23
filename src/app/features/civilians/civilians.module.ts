import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CiviliansRoutingModule } from './civilians-routing.module';
import { CiviliansComponent } from './civilians.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { CiviliansListComponent } from './pages/civilians-list/civilians-list.component';
import { CiviliansViewComponent } from './pages/civilians-view/civilians-view.component';

@NgModule({
  declarations: [CiviliansComponent, CiviliansListComponent, CiviliansViewComponent],
  imports: [
    CommonModule,
    CiviliansRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDropdownModule,
  ],
})
export class CiviliansModule {}
