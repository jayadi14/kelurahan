import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FcDataNavigationService } from './fc-data-navigation.service';

@Component({
  selector: 'fc-data-navigation',
  templateUrl: './fc-data-navigation.component.html',
  styleUrls: ['./fc-data-navigation.component.css'],
})
export class FcDataNavigationComponent implements OnInit {
  previousId?: number;
  nextId?: number;
  @Input() baseUrl = '';
  curId!: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fcDataNavigation: FcDataNavigationService
  ) {
    this.curId = String(this.route.snapshot.paramMap.get('id'));
    this.setNavigator();
  }

  ngOnInit(): void {}
  setNavigator() {
    let dataNavigationConfig: any =
      this.fcDataNavigation.getDataNavigationConfig;
    let dataLabel = dataNavigationConfig.label;
    if (this.router.url.split('/').includes(dataLabel)) {
      let dataIds: number[] = dataNavigationConfig.ids;
      dataIds.map((id: number, i: number) => {
        if (id == this.curId) {
          if (dataIds[i - 1]) {
            // previous exist
            this.previousId = dataIds[i - 1];
          }
          if (dataIds[i + 1]) {
            // next exist
            this.nextId = dataIds[i + 1];
          }
        }
      });
    }
  }
  navigateToPrevious() {
    if (this.previousId) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate([this.baseUrl, this.previousId], {
          replaceUrl: true,
        })
      );
    }
  }
  navigateToNext() {
    if (this.nextId) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate([this.baseUrl, this.nextId], {
          replaceUrl: true,
        })
      );
    }
  }
}
