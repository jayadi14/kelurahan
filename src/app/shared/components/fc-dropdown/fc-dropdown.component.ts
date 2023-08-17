import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fc-dropdown',
  templateUrl: './fc-dropdown.component.html',
  styleUrls: ['./fc-dropdown.component.css'],
})
export class FcDropdownComponent implements OnInit {
  @Input() fcStyle: any;
  @Input() fcStyleClass?: string;

  dropdownOpened: boolean = false;
  destroyCallback?: Function;
  target: any;
  render: boolean = false;
  container?: HTMLDivElement;
  @Input() viewType = 'overlay';

  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.document.addEventListener('click', this.onDocumentClick.bind(this));
    });

    this.router.events.subscribe(() => {
      // hide dropdown when route has changed
      this.hide();
    });
  }

  ngOnInit(): void {}
  toggle(event: Event, target?: any) {
    if (this.dropdownOpened) {
      if (this.hasTargetChanged(event, target)) {
        this.destroyCallback = () => {
          this.show(null, target || event.currentTarget || event.target);
        };
      }
      this.hide();
    } else {
      this.show(event, target);
    }
  }
  show(event: any, target?: any) {
    this.target = target || event.currentTarget || event.target;
    this.dropdownOpened = true;
    this.render = true;
    this.cd.markForCheck();
  }
  hasTargetChanged(event: Event, target?: any) {
    return (
      this.target != null &&
      this.target !== (target || event.currentTarget || event.target)
    );
  }
  hide() {
    this.dropdownOpened = false;
    this.cd.markForCheck();
  }
  onDocumentClick(e: MouseEvent) {
    if (
      !this.elRef.nativeElement.contains(e.target) &&
      this.dropdownOpened &&
      !this.target.contains(event?.target)
    ) {
      this.ngZone.run(() => {
        this.dropdownOpened = false;
      });
    }
  }
}
