import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { MessageService } from 'primeng/api';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

@Component({
  selector: 'app-warehouse-select-dialog',
  templateUrl: './warehouse-select-dialog.component.html',
  styleUrls: ['./warehouse-select-dialog.component.css'],
})
export class WarehouseSelectDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;

  warehouses: Warehouse[] = [];

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

  existingWarehouses: any[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private warehouseService: WarehouseService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ) {
    if (this.config.data.existingWarehouse) {
      this.existingWarehouses = this.config.data.existingWarehouse;
    }

    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
  }

  ngOnInit(): void {
    this.loadData();
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
    dataListParameter.filterObj = filterObj;
    dataListParameter.searchQuery = searchQuery;
    this.warehouseService
      .getWarehouses(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.warehouses = res.data.warehouses;
        // Check existing data
        this.existingWarehouses.forEach((existWarehouse) => {
          let warehouseData = this.warehouses.find(
            (data: any) => data.id == existWarehouse.warehouse.id
          );
          if (warehouseData) {
            warehouseData.exist = true;
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

  submit(res: Warehouse) {
    this.ref.close(res);
  }
  onClose() {
    this.ref.close();
  }
}
