import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchasePaymentService } from '@features/purchase-payment/services/purchase-payment.service';
import {
  faEye,
  faFilter,
  faLocationDot,
  faPhone,
  faPlus,
  faRefresh,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterDialogComponent } from '@shared/components/fc-filter-dialog/fc-filter-dialog.component';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-payment-list',
  templateUrl: './purchase-payment-list.component.html',
  styleUrls: ['./purchase-payment-list.component.css'],
})
export class PurchasePaymentListComponent {
  private readonly destroy$ = new Subject<void>();
  // Icons
  faLocationDot = faLocationDot;
  faUser = faUser;
  faPhone = faPhone;
  faEye = faEye;

  loading: boolean = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  purchasePayments: any[] = [];
  selectedPurchasePayment: any;

  actionButtons: any[] = [
    {
      label: 'Add',
      icon: faPlus,
      route: ['/purchase-payment/add'],
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
      action: () => {
        this.onFilter();
      },
    },
  ];

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    filterOptions: [
      {
        options: [
          { name: 'All', value: null },
          { name: 'Draft', value: 0 },
          { name: 'Approved', value: 1 },
          { name: 'Cancelled', value: 2 },
        ],
        selectedValue: null,
        optionLabel: 'Status',
        optionValue: 'status',
      },
    ],
    sort: {
      fields: [
        { name: 'id', header: 'Id' },
        { name: 'date', header: 'Date' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  constructor(
    private layoutService: LayoutService,
    private purchasePaymentService: PurchasePaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private dialogService: DialogService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Purchase Payment',
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
          featureName: 'purchase payment',
          baseHref: '/purchase-payment/list',
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
        this.fcFilterConfig.filterOptions?.map((filterOption: any) => {
          if (params[filterOption.optionValue]) {
            filterOption.selectedValue = String(
              params[filterOption.optionValue]
            );
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
        if (config.featureName == 'purchase payment') {
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
    if (this.fcFilterConfig.sort.selectedField) {
      queryParams.order_by = this.fcFilterConfig.sort.selectedField;
      queryParams.direction = this.fcFilterConfig.sort.direction;
    }
    // filter conditions
    this.fcFilterConfig.filterFields?.map((field: any) => {
      if (field.value) {
        queryParams[field.name] = field.value;
        if (field.type == 'object') {
          queryParams[field.name + '-label'] = field.valueLabel;
        }
      }
    });
    this.fcFilterConfig.filterOptions?.map((filterOption: any) => {
      if (filterOption.selectedValue != null) {
        queryParams[filterOption.optionValue] = filterOption.selectedValue;
      }
    });
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
    this.purchasePaymentService
      .getPurchasePayments(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalRecords = res.data.count;
          this.totalPages =
            this.totalRecords > this.rows
              ? Math.ceil(this.totalRecords / this.rows)
              : 1;
          this.purchasePayments = res.data.purchase_payments;
          if (this.purchasePayments.length > 0) {
            this.selectedPurchasePayment = this.purchasePayments[0];
          }
          this.loading = false;
          this.layoutService.setSearchConfig({
            loading: false,
          });
        },
        error: (err: any) => {
          this.loading = false;
          this.layoutService.setSearchConfig({
            loading: false,
          });
        },
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
    this.loadData();
  }
  navigateToDetail(purchasePayment: any) {
    this.router.navigate(['/purchase-payment/view/', purchasePayment.id]);
  }
  getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'border border-gray-600 dark:border-gray-700 bg-gray-100 dark:bg-gray-700/20 text-gray-500';
      case 1:
        return 'border border-green-600 dark:border-green-700 bg-green-100 dark:bg-green-700/20 text-green-500';
      case 2:
        return 'border border-red-600 dark:border-red-700 bg-red-100 dark:bg-red-700/20 text-red-500';
      default:
        return '';
    }
  }
  onFilter() {
    const ref = this.dialogService.open(FcFilterDialogComponent, {
      data: {
        fcFilterConfig: this.fcFilterConfig,
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((res: any) => {
      if (res) {
        this.fcFilterConfig = res;
        this.loadData();
      }
    });
  }
}
