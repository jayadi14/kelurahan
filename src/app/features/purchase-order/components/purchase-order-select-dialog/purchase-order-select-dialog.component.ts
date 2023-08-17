import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from '@features/purchase-order/interfaces/purchase-order';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-purchase-order-select-dialog',
  templateUrl: './purchase-order-select-dialog.component.html',
  styleUrls: ['./purchase-order-select-dialog.component.css'],
})
export class PurchaseOrderSelectDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;

  purchaseOrders: PurchaseOrder[] = [];

  searchQuery: string = '';
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = '';

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [{ name: 'name', header: 'Name' }],
      selectedField: 'id',
      direction: 'desc',
    },
  };
  filter: string = '';

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.filter) {
      this.filter = this.config.data.filter;
    }
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  setParam() {
    let queryParams: any = {
      page: this.page,
      limit: this.rows,
    };
    if (this.searchQuery) {
      queryParams.searchQuery = this.searchQuery;
    }
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

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = this.page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = this.filter;
    dataListParameter.searchQuery = searchQuery;
    this.purchaseOrderService
      .getPurchaseOrders(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.purchaseOrders = res.data.purchase_orders;
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

  search() {
    this.page = 1;
    this.loadData(this.page);
  }

  submit(res: PurchaseOrder) {
    this.ref.close(res);
  }
  onClose() {
    this.ref.close();
  }
}
