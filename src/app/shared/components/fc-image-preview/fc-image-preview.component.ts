import { Component, Input, ViewChild } from '@angular/core';
import {
  faArrowUpRightFromSquare,
  faRefresh,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fc-image-preview',
  templateUrl: './fc-image-preview.component.html',
  styleUrls: ['./fc-image-preview.component.css'],
})
export class FcImagePreviewComponent {
  faTimes = faTimes;
  faRefresh = faRefresh;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  loading = true;

  @Input() src: string = '';
  @Input() srcError: string = '/assets/images/placeholder/error.webp';
  @Input() alt: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() actionButtons: any[] = [];
  showPreview = false;
  @Input() preview = false;

  isError = false;
  loadSuccess() {
    this.loading = false;
  }
  setErrorImg() {
    this.isError = true;
  }
  @ViewChild('imageDialog') imageDialog: any;

  handleClick() {
    if (!this.loading) {
      if (this.isError) {
        this.retry();
      } else {
        if (this.preview) {
          this.showPreview = true;
          this.imageDialog.maximized = true;
        }
      }
    }
  }
  retry() {
    this.isError = false;
  }
}
