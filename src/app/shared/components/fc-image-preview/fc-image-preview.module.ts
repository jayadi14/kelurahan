import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { FcImagePreviewComponent } from './fc-image-preview.component';

@NgModule({
  declarations: [FcImagePreviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ImageModule,
    DialogModule,
  ],
  exports: [FcImagePreviewComponent],
})
export class FcImagePreviewModule {}
