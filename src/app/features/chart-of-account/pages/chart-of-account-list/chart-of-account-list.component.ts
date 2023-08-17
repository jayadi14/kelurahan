import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOfAccount } from '@features/chart-of-account/interfaces/chart-of-account';
import { ChartOfAccountService } from '@features/chart-of-account/services/chart-of-account.service';
import {
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
  selector: 'app-chart-of-account-list',
  templateUrl: './chart-of-account-list.component.html',
  styleUrls: ['./chart-of-account-list.component.css'],
})
export class ChartOfAccountListComponent {
  private readonly destroy$ = new Subject<void>();
  faLocationDot = faLocationDot;
  faUser = faUser;
  faPhone = faPhone;
  faEye = faEye;

  actionButtons: any[] = [
    {
      label: 'Add',
      icon: faPlus,
      route: ['/chart-of-account/add'],
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

  chartOfAccounts: ChartOfAccount[] = [
    {
      id: 72824276,
      name: 'Kas',
      number: '1-10001',
      description: null,
      archive: false,
      lock: false,
      system_or_product_link: false,
      is_parent: false,
      indent: 0,
      currency_code: null,
      category: 'Cash & Bank',
      category_id: 3,
      balance: 'Rp.  0,00',
      balance_amount: 0,
      parent_id: null,
      parent: [],
      created_at: '2023-04-26T05:39:44.000Z',
      updated_at: '2023-04-26T05:39:44.000Z',
      deleted_at: null,
      custom_id: null,
      tax_id: null,
      tax_name: null,
      bank_account_no: null,
      bank_name: null,
      is_company_default_account: false,
      can_destroy_account: true,
      can_show_account: true,
      can_open_company_tax: true,
      currency_symbol: null,
      children: null,
    },
    {
      id: 72824277,
      name: 'Rekening Bank',
      number: '1-10002',
      description: null,
      archive: false,
      lock: false,
      system_or_product_link: false,
      is_parent: false,
      indent: 0,
      currency_code: null,
      category: 'Cash & Bank',
      category_id: 3,
      balance: 'Rp.  0,00',
      balance_amount: 0,
      parent_id: null,
      parent: [],
      created_at: '2023-04-26T05:39:44.000Z',
      updated_at: '2023-04-26T05:39:44.000Z',
      deleted_at: null,
      custom_id: null,
      tax_id: null,
      tax_name: null,
      bank_account_no: null,
      bank_name: null,
      is_company_default_account: false,
      can_destroy_account: true,
      can_show_account: true,
      can_open_company_tax: true,
      currency_symbol: null,
      children: null,
    },
    {
      id: 72824329,
      name: 'Piutang Usaha',
      number: '1-10100',
      description: null,
      archive: false,
      lock: true,
      system_or_product_link: true,
      is_parent: false,
      indent: 0,
      currency_code: null,
      category: 'Accounts Receivable (A/R)',
      category_id: 1,
      balance: 'Rp.  0,00',
      balance_amount: 0,
      parent_id: null,
      parent: [],
      created_at: '2023-04-26T05:39:46.000Z',
      updated_at: '2023-04-26T05:39:46.000Z',
      deleted_at: null,
      custom_id: null,
      tax_id: null,
      tax_name: null,
      bank_account_no: null,
      bank_name: null,
      is_company_default_account: true,
      can_destroy_account: true,
      can_show_account: true,
      can_open_company_tax: true,
      currency_symbol: null,
      children: null,
    },
    {
      id: 72824400,
      name: 'Piutang Belum Ditagih',
      number: '1-10101',
      description: null,
      archive: false,
      lock: true,
      system_or_product_link: true,
      is_parent: false,
      indent: 0,
      currency_code: null,
      category: 'Accounts Receivable (A/R)',
      category_id: 1,
      balance: 'Rp.  0,00',
      balance_amount: 0,
      parent_id: null,
      parent: [],
      created_at: '2023-04-26T05:39:52.000Z',
      updated_at: '2023-04-26T05:39:52.000Z',
      deleted_at: null,
      custom_id: null,
      tax_id: null,
      tax_name: null,
      bank_account_no: null,
      bank_name: null,
      is_company_default_account: true,
      can_destroy_account: true,
      can_show_account: true,
      can_open_company_tax: true,
      currency_symbol: null,
      children: null,
    },
    {
      id: 72824397,
      name: 'Persediaan Barang',
      number: '1-10200',
      description: null,
      archive: false,
      lock: true,
      system_or_product_link: true,
      is_parent: false,
      indent: 0,
      currency_code: null,
      category: 'Inventory',
      category_id: 4,
      balance: 'Rp.  0,00',
      balance_amount: 0,
      parent_id: null,
      parent: [],
      created_at: '2023-04-26T05:39:49.000Z',
      updated_at: '2023-04-26T05:39:49.000Z',
      deleted_at: null,
      custom_id: null,
      tax_id: null,
      tax_name: null,
      bank_account_no: null,
      bank_name: null,
      is_company_default_account: true,
      can_destroy_account: true,
      can_show_account: true,
      can_open_company_tax: true,
      currency_symbol: null,
      children: null,
    },
    {
      id: 72824278,
      name: 'Piutang Lainnya',
      number: '1-10300',
      description: null,
      archive: false,
      lock: false,
      system_or_product_link: false,
      is_parent: false,
      indent: 0,
      currency_code: null,
      category: 'Other Current Assets',
      category_id: 2,
      balance: 'Rp.  0,00',
      balance_amount: 0,
      parent_id: null,
      parent: [],
      created_at: '2023-04-26T05:39:44.000Z',
      updated_at: '2023-04-26T05:39:44.000Z',
      deleted_at: null,
      custom_id: null,
      tax_id: null,
      tax_name: null,
      bank_account_no: null,
      bank_name: null,
      is_company_default_account: false,
      can_destroy_account: true,
      can_show_account: true,
      can_open_company_tax: true,
      currency_symbol: null,
      children: null,
    },
  ];
  selectedChartOfAccount: ChartOfAccount | undefined;

  constructor(
    private layoutService: LayoutService,
    private chartOfAccountService: ChartOfAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Chart Of Accounts',
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
          featureName: 'chart of account',
          baseHref: '/chart-of-account/list',
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
    // this.loadData();
    // load data when search
    this.layoutService.searchConfigSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config.featureName == 'chart of account') {
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
  onChangeChartOfAccount(chartOfAccount: ChartOfAccount) {
    this.selectedChartOfAccount = chartOfAccount;
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
    this.chartOfAccountService
      .getChartOfAccounts(dataListParameter)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.chartOfAccounts = res.data.chartOfAccounts;
          if (this.chartOfAccounts.length > 0) {
            this.selectedChartOfAccount = this.chartOfAccounts[0];
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
    this.loadData(this.page);
  }
  navigateToDetail(chartOfAccount: ChartOfAccount) {
    this.router.navigate(['/chart-of-account/view/', chartOfAccount.id]);
  }
}
