import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputNumberModule } from 'primeng/inputnumber';
import { FcPaginationDialogComponent } from './components/fc-pagination-dialog/fc-pagination-dialog.component';
import { FcPaginationComponent } from './fc-pagination.component';

@NgModule({
  declarations: [FcPaginationComponent, FcPaginationDialogComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    InputNumberModule,
    CommonModule,
    FormsModule,
  ],
  exports: [FcPaginationComponent],
})
export class FcPaginationModule {}
