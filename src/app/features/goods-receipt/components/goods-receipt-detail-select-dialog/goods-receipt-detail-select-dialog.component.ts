import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsReceipt } from '@features/goods-receipt/interfaces/goods-receipt';
import { GoodsReceiptService } from '@features/goods-receipt/services/goods-receipt.service';
import { PurchaseInvoice } from '@features/purchase-invoice/interfaces/purchase-invoice';
import { PurchaseInvoiceService } from '@features/purchase-invoice/services/purchase-invoice.service';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-goods-receipt-detail-select-dialog',
  templateUrl: './goods-receipt-detail-select-dialog.component.html',
  styleUrls: ['./goods-receipt-detail-select-dialog.component.css']
})
export class GoodsReceiptDetailSelectDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown

  goodsReceipts: GoodsReceipt[] = [];

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

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fcFilterDialogService: FcFilterDialogService,
    private goodsReceiptService: GoodsReceiptService,
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
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
    if (this.config.data.statusFilter) {
      dataListParameter.filterObj = this.config.data.statusFilter;
    } else{
      dataListParameter.filterObj = filterObj;
    }
    dataListParameter.searchQuery = searchQuery;
    this.goodsReceiptService
      .getGoodsReceipts(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.goodsReceipts = res.data.goods_receipts;
      });
  }

  showDetail(index:any){
    this.goodsReceipts[index].showDetail = !this.goodsReceipts[index].showDetail
    if(!this.goodsReceipts[index].goodsReceiptDetailLoaded){
      this.loadGoodsReceipt(this.goodsReceipts[index].id, index)
    }
  }

  loadGoodsReceipt(id:any, index:any){
    this.goodsReceipts[index].loading = true
    this.goodsReceiptService
    .getGoodsReceipt(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
      this.goodsReceipts[index].loading = false
      this.goodsReceipts[index].goodsReceiptDetailLoaded = true
      this.goodsReceipts[index].goods_receipt_details = res.data.goods_receipt_details;
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

  submit(res: any) {
    this.ref.close(res);
  }
  onClose() {
    this.ref.close();
  }
}
