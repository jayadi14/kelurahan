import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Staff } from '@features/staff/interfaces/staff';
import { StaffService } from '@features/staff/services/staff.service';
import {
  faBars,
  faEye,
  faFilter,
  faList,
  faLocationDot,
  faPhone,
  faPlus,
  faRefresh,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { Subject, take, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
})
export class StaffListComponent implements OnInit, AfterContentInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  faLocationDot = faLocationDot;
  faUser = faUser;
  faPhone = faPhone;
  faEye = faEye;
  quickView = false;

  actionButtons: any[] = [
    {
      label: 'Add',
      icon: faPlus,
      route: ['/staff/add'],
      action: () => {},
    },
  ];
  filterButtons: any[] = [
    {
      label: 'Refresh',
      icon: faRefresh,
      action: () => {
        this.loadData();
      },
    },
    {
      label: 'Filter',
      icon: faFilter,
      action: () => {},
    },
    {
      label: 'Quick View',
      icon: faBars,
      action: () => {
        this.onChangeQuickView();
      },
    },
  ];
  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [
        { name: 'name', header: 'Nama' },
        { name: 'email', header: 'Email' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };
  loading: boolean = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  staffs: Staff[] = [];
  selectedStaff: Staff | undefined;

  constructor(
    private layoutService: LayoutService,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Staffs',
      icon: '',
      showHeader: true,
    });
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = params.page ? params.page : 1;
        this.rows = params.limit ? params.limit : 10;
        this.searchQuery = params.searchQuery ? params.searchQuery : '';

        this.layoutService.setSearchConfig({
          searchQuery: this.searchQuery,
          featureName: 'staff',
          baseHref: '/staff/list',
        });
        if (params.order_by && params.direction) {
          this.fcFilterConfig.sort.selectedField = params.order_by;
          this.fcFilterConfig.sort.direction = params.direction;
        }
        this.fcFilterConfig.filterFields?.map((field: any) => {
          if (params[field.name]) {
            field.value = String(params[field.name]);
            if (field.type == 'object') {
              field.valueLabel = String(params[field.name + '-label']);
            }
          }
        });
      });
  }
  ngOnInit(): void {
    // initial load Data
    this.loadData();

    // load data when search
    this.layoutService.searchConfigSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config.featureName == 'staff') {
          if (this.searchQuery != config.searchQuery) {
            this.searchQuery = config.searchQuery;
            this.loadData();
          }
        }
      });
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onChangeStaff(staff: Staff) {
    this.selectedStaff = staff;
  }
  onChangeQuickView() {
    this.quickView = !this.quickView;
    this.filterButtons[2].icon = this.quickView ? faList : faBars;
  }

  setParam() {
    let queryParams: any = {
      page: this.page,
      limit: this.rows,
    };
    if (this.searchQuery) {
      queryParams.searchQuery = this.searchQuery;
    }

    // end filter conditions
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true,
    });
  }

  loadData(
    page: number = 0,
    searchQuery: string = this.searchQuery,
    filterObj: string = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    ),
    sortBy: string = this.fcFilterDialogService.getSortString(
      this.fcFilterConfig
    )
  ) {
    this.setParam();
    this.loading = true;
    this.layoutService.setSearchConfig({
      loading: true,
    });

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = this.page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = filterObj;
    dataListParameter.searchQuery = searchQuery;
    this.staffService
      .getStaffs(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.totalRecords = res.data.count;
        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows)
            : 1;
        this.staffs = res.data.staff;
        if (this.staffs.length > 0) {
          this.selectedStaff = this.staffs[0];
        }
        this.loading = false;
        this.layoutService.setSearchConfig({
          loading: false,
        });
      });
  }
  onPageUpdate(pagination: any) {
    let page = pagination.page;
    let rows = pagination.rows;
    this.rows = rows;
    if (page > 0) {
      this.page = page;
    } else {
      this.page = 1;
    }
    this.loadData(this.page);
  }
  navigateToDetail(staff: Staff) {
    this.router.navigate(['/staff/view/', staff.id]);
  }
}
