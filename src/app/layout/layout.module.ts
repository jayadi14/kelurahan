import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { FcDrawerModule } from '@shared/components/fc-drawer/fc-drawer.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcDropdownModule } from '../shared/components/fc-dropdown/fc-dropdown.module';
import { HeaderComponent } from './component/header/header.component';
import { MobileNavigationComponent } from './component/mobile-navigation/mobile-navigation.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    MobileNavigationComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    FcDropdownModule,
    FormsModule,
    FcDrawerModule,
  ],
})
export class LayoutModule {}
