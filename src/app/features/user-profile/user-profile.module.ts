import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { SharedModule } from '@shared/shared.module';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserProfileRoutingModule,
    FcInputTextModule,
  ],
})
export class UserProfileModule {}
