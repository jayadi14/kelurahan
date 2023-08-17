import { Component } from '@angular/core';
import { Inventory } from '@features/inventory/interfaces/inventory';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductService } from '@features/product/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { Product } from '@features/product/interfaces/product.interface';

@Component({
  selector: 'app-inventory-select-dialog',
  templateUrl: './inventory-select-dialog.component.html',
  styleUrls: ['./inventory-select-dialog.component.css'],
})
export class InventorySelectDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;

  inventories: any;
  searchQuery: string = '';
  allowedFilteringData = true;
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
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService
  ) {
    if (this.config.data.inventories) {
      this.allowedFilteringData = false;
      this.inventories = this.config.data.inventories;
    }

    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
  }

  ngOnInit(): void {}

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
  }

  search() {
    this.page = 1;
  }

  submit(res: any) {
    this.ref.close(res);
  }
  onClose() {
    this.ref.close();
  }
}
