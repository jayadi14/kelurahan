import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { faEllipsisVertical, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AnimationItem } from 'lottie-web';
import { FcToast } from '../../fc-toast.interface';

@Component({
  selector: 'fc-toast-item',
  templateUrl: './toast-item.component.html',
  styleUrls: ['./toast-item.component.css'],
})
export class ToastItemComponent {
  faEllipsisVertical = faEllipsisVertical;
  faTimes = faTimes;

  @Input() index!: number;

  @Input() toast!: FcToast;

  @Output() onClose = new EventEmitter<any>();

  timeout: any;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.initTimeout();
    setTimeout(() => {
      this.toast.showed = true;
    }, 300);
  }
  initTimeout() {
    if (!this.toast.sticky) {
      this.zone.runOutsideAngular(() => {
        this.timeout = setTimeout(() => {
          this.close();
        }, this.toast.life || 3000);
      });
    }
  }
  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
  close() {
    this.onClose.emit(this.toast);
  }
  ngOnDestroy() {
    this.clearTimeout();
  }
  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }
}
