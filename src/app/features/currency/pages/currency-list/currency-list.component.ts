import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '@features/currency/services/currency.service';
import {
  faBars,
  faEye,
  faFilter,
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
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css'],
})
export class CurrencyListComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();
  // Icon
  faLocationDot = faLocationDot;
  faUser = faUser;
  faPhone = faPhone;
  faEye = faEye;

  actionButtons: any[] = [
    {
      label: 'Add',
      icon: faPlus,
      route: ['/currency/add'],
      action: () => {},
    },
  ];

  filterButtons: any[] = [
    {
      label: 'Refresh',
      icon: faRefresh,
      action: () => {
        this.loadData(1);
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
      action: () => {},
    },
  ];

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [{ name: 'name', header: 'Nama' }],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  currencies: any = [
    {
      id: '1',
      name: 'USD',
      rate: 15000,
    },
    {
      id: '2',
      name: 'RMB',
      rate: 2300,
    },
  ];

  loading: boolean = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  constructor(
    private layoutService: LayoutService,
    private currencyService: CurrencyService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService
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
          featureName: 'Pengguna',
          baseHref: '/currency/list',
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
    this.layoutService.searchConfigSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config.featureName == 'currency') {
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
    this.currencyService
      .getCurrencies(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.currencies = res.data.currencies;
        this.loading = false;
        this.layoutService.setSearchConfig({
          loading: false,
        });
      });
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

  navigateToDetail(id: string) {
    this.router.navigate(['/currency/view/' + id]);
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
}
