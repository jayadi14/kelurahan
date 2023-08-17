import { Component } from '@angular/core';
import { SupplierQuotation } from '@features/supplier-quotation/interfaces/supplier-quotation';
import {
  faChevronDown,
  faChevronUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SupplierQuotationService } from '@features/supplier-quotation/services/supplier-quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { MessageService } from 'primeng/api';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

@Component({
  selector: 'app-supplier-quotation-select-dialog',
  templateUrl: './supplier-quotation-select-dialog.component.html',
  styleUrls: ['./supplier-quotation-select-dialog.component.css'],
})
export class SupplierQuotationSelectDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  supplierQuotations: SupplierQuotation[] = [];

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
    private supplierQuotationService: SupplierQuotationService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
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
    } else {
      dataListParameter.filterObj = filterObj;
    }
    dataListParameter.searchQuery = searchQuery;
    this.supplierQuotationService
      .getSupplierQuotations(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.supplierQuotations = res.data.supplier_quotations;
      });
  }

  showDetail(index: any) {
    this.supplierQuotations[index].showDetail =
      !this.supplierQuotations[index].showDetail;
    if (!this.supplierQuotations[index].supplierQuotationDetailLoaded) {
      this.loadSupplierQuotationDetails(
        this.supplierQuotations[index].id,
        index
      );
    }
  }

  loadSupplierQuotationDetails(id: any, index: any) {
    this.supplierQuotations[index].loading = true;
    this.supplierQuotationService
      .getSupplierQuotation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.supplierQuotations[index].loading = false;
        this.supplierQuotations[index].supplierQuotationDetailLoaded = true;
        this.supplierQuotations[index].supplier_quotation_details =
          res.data.supplier_quotation_details;
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
