import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  faChevronDown,
  faChevronLeft,
  faCog,
  faEllipsisVertical,
  faFilter,
  faPlus,
  faRefresh,
  faSave,
  faSortAlphaUp,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-fc-action-bar',
  templateUrl: './fc-action-bar.component.html',
  styleUrls: ['./fc-action-bar.component.css'],
})
export class FcActionBarComponent {
  // fontawesome
  faPlus = faPlus;
  faTrash = faTrash;
  faSave = faSave;
  faCog = faCog;
  faChevronDown = faChevronDown;
  faFilter = faFilter;
  faSortAlphaUp = faSortAlphaUp;
  faRefresh = faRefresh;
  faEllipsisVertical = faEllipsisVertical;
  faChevronLeft = faChevronLeft;
  faSpinner = faSpinner;

  @Input() isHasBackButton = false;
  @Input() actionButtons: any[] = [];
  @Input() hiddenActionButtons: any[] = [];
  @Input() filterButtons: any[] = [];

  constructor(private location: Location) {}
  back() {
    this.location.back();
  }
  get isHasMoreButton() {
    return this.actionButtons.filter((x) => !x.hidden && !x.route).length > 0;
  }
}
