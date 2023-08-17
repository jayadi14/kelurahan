import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { faEllipsisVertical, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FcToast } from './fc-toast.interface';
import { FcToastService } from './fc-toast.service';
import { UniqueComponentId } from './uniquecomponentid';

@Component({
  selector: 'fc-toast',
  templateUrl: './fc-toast.component.html',
  styleUrls: ['./fc-toast.component.css'],
})
export class FcToastComponent {
  faTimes = faTimes;
  faEllipsisVertical = faEllipsisVertical;
  showConfirmation = false;

  confirmationToast: FcToast = {
    id: UniqueComponentId(),
    header: 'Confirmation Toast',
    subheader: 'Subheader',
    message: 'Toast Message',
    showed: true,
    type: 'confirmation',
  };

  @Input() key?: string;

  toasts: FcToast[] = [];
  toastsArchieve: FcToast[] = [];

  @Input() preventDuplicates: boolean = false;

  @Input() preventOpenDuplicates: boolean = false;

  toastSubscription: Subscription;

  clearSubscription: Subscription;

  constructor(
    private fcToastService: FcToastService,
    private cd: ChangeDetectorRef
  ) {
    this.toastSubscription = this.fcToastService.messageObserver.subscribe(
      (toast) => {
        if (toast) {
          if (toast instanceof Array) {
            const filteredMessages = toast.filter((m) => this.canAdd(m));
            this.add(filteredMessages);
          } else if (this.canAdd(toast)) {
            // set default lottie options by severity
            if (toast.severity) {
              if (!toast.lottieOption) {
                toast.lottieOption = {
                  path: `/assets/lotties/${toast.severity}.json`,
                  loop: false,
                };
              }
            }
            this.add([toast]);
          }
        }
      }
    );

    this.clearSubscription = this.fcToastService.clearObserver.subscribe(
      (key) => {
        if (key) {
          if (this.key === key) {
            this.toasts = [];
          }
        } else {
          this.toasts = [];
        }

        this.cd.markForCheck();
      }
    );
  }

  canAdd(toast: FcToast): boolean {
    let allow = this.key === toast.key;

    if (allow && this.preventOpenDuplicates) {
      allow = !this.containsMessage(this.toasts, toast);
    }

    if (allow && this.preventDuplicates) {
      allow = !this.containsMessage(this.toastsArchieve, toast);
    }

    return allow;
  }
  add(toasts: FcToast[]): void {
    this.toasts = this.toasts ? [...toasts, ...this.toasts] : [...toasts];

    if (this.preventDuplicates) {
      this.toastsArchieve = this.toastsArchieve
        ? [...toasts, ...this.toastsArchieve]
        : [...toasts];
    }

    this.cd.markForCheck();
  }

  containsMessage(collection: FcToast[], message: FcToast): boolean {
    if (!collection) {
      return false;
    }

    return (
      collection.find((m) => {
        return (
          m.header === message.header &&
          m.message == message.message &&
          m.severity === message.severity
        );
      }) != null
    );
  }

  addNewToast() {
    // add to first
    this.toasts.unshift({
      id: UniqueComponentId(),
      header: 'Toast Title',
      subheader: 'Subheader',
      message: 'Toast Message',
      showed: false,
      type: 'static',
    });
    setTimeout(() => {
      this.toasts[0].showed = true;
    }, 100);
  }
  hideToast(item: any) {
    let id = item.id;
    let toastIndex = this.toasts.findIndex((toast) => toast.id === id);
    this.toasts[toastIndex].showed = false;
    setTimeout(() => {
      this.toasts.splice(toastIndex, 1);

      this.cd.detectChanges();
    }, 500);
    this.cd.detectChanges();
  }
  clearAll() {
    let myclearance = setInterval(() => {
      if (this.toasts.length === 0) {
        // break interval
        clearInterval(myclearance);
      } else {
        this.toasts[this.toasts.length - 1].showed = false;
        setTimeout(() => {
          this.toasts.pop();
        }, 600);
      }
    }, 300);
  }
  isShowAllitem = false;
  toggleMessage() {
    this.isShowAllitem = !this.isShowAllitem;
  }
}
