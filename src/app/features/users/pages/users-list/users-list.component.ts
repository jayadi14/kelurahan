import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  faCheck,
  faChevronDown,
  faCog,
  faEye,
  faFilter,
  faLocationDot,
  faPlus,
  faRefresh,
  faSave,
  faSortAlphaUp,
  faTrash,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { UsersService } from '@features/users/services/users.services';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { User } from '@features/users/interfaces/users';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faPlus = faPlus;
  faCheck = faCheck;
  faX = faX;
  faTrash = faTrash;
  faSave = faSave;
  faEye = faEye;
  faCog = faCog;
  faChevronDown = faChevronDown;
  faFilter = faFilter;
  faSortAlphaUp = faSortAlphaUp;
  faRefresh = faRefresh;
  faLocationDot = faLocationDot;

  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';
  actionButtons: any[] = [
    {
      label: 'Tambah Pengguna',
      icon: faPlus,

      route: ['/users/add'],
      action: () => {},
    },
  ];

  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {
        this.loadData();
      },
    },
  ]

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [
        { name: 'name', header: 'Name' },
        { name: 'note', header: 'Note' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  users: User[] = []

  constructor(
    private layoutService: LayoutService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Pengguna',
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
          featureName: 'users',
          baseHref: '/users/list',
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
    this.loadData();

    // load data when search
    this.layoutService.searchConfigSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config.featureName == 'users') {
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
  ){
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
    this.userService
      .getUsers(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.layoutService.setSearchConfig({
          loading: false,
        });
        this.totalRecords = res.data.count;
        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows)
            : 1;
        this.users = res.data.users;
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

  approveUser(userId:number, approve:number){
    let message = ''
    if(approve == 1){
      message = "menyetujui"
    }else{
      message = "menolak"
    }
    this.fcConfirmService.open({
      header: 'Confirmation',
      message:  `Apakah kamu yakin ingin ${message} registrasi user ini?`,
      accept: () => {
        this.userService
          .approveUserRegister(userId,approve)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Approve Pengguna',
                message: res.message,
              });
              this.loadData()
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Approval Pengguna',
                message: err.message,
              });
            },
          });
      },
    });
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: //pending
        return 'border border-gray-600 dark:border-gray-700 bg-gray-100 dark:bg-gray-700/20 text-gray-500';
      case 1: // approve
        return 'border border-green-600 dark:border-green-700 bg-green-100 dark:bg-green-700/20 text-green-500';
      case 2: // cancel
        return 'border border-red-600 dark:border-red-700 bg-red-100 dark:bg-red-700/20 text-red-500';
      default:
        return '';
    }
  }
}
