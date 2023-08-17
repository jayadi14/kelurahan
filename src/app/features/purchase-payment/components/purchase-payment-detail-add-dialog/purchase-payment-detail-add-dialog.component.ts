import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseInvoice } from '@features/purchase-invoice/interfaces/purchase-invoice';
import { PurchaseInvoiceService } from '@features/purchase-invoice/services/purchase-invoice.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-purchase-payment-detail-add-dialog',
  templateUrl: './purchase-payment-detail-add-dialog.component.html',
  styleUrls: ['./purchase-payment-detail-add-dialog.component.css'],
})
export class PurchasePaymentDetailAddDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;

  purchaseInvoices: PurchaseInvoice[] = [];

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

  purchasePaymentDetailForm: FormGroup;
  purchasePaymentDetails: any[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.purchasePaymentDetails) {
      this.purchasePaymentDetails = structuredClone(
        this.config.data.purchasePaymentDetails
      );
    }

    this.purchasePaymentDetailForm = new FormGroup({
      purchase_invoice: new FormControl(null),
      amount_allocated: new FormControl(0),
    });
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
    dataListParameter.filterObj = filterObj + 'status=2&with_filter=1';
    dataListParameter.searchQuery = searchQuery;
    this.purchaseInvoiceService
      .getPurchaseInvoices(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.purchaseInvoices = res.data.purchase_invoices;
        // check if product is already added then status exist
        this.purchaseInvoices.forEach((purchaseInvoice: any) => {
          let purchasePaymentDetailInvoice = this.purchasePaymentDetails.find(
            (purchasePaymentDetail: any) =>
              purchasePaymentDetail.purchase_invoice.id === purchaseInvoice.id
          );
          if (purchasePaymentDetailInvoice) {
            purchaseInvoice.exist = true;
          }
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

  search() {
    this.page = 1;
    this.loadData(this.page);
  }

  onSelectPurchaseInvoice(purchaseInvoice: PurchaseInvoice) {
    this.purchasePaymentDetailForm.patchValue({
      purchase_invoice: purchaseInvoice,
      amount_allocated: Number(purchaseInvoice.remaining_amount),
    });
  }
  onRemovePurchaseInvoice() {
    this.purchasePaymentDetailForm.reset();
  }
  submit() {
    this.ref.close(this.purchasePaymentDetailForm.value);
  }
  onClose() {
    this.ref.close();
  }
}
