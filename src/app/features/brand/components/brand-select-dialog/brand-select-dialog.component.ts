import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Brand } from '@features/brand/interfaces/brand';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrandService } from '@features/brand/services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { MessageService } from 'primeng/api';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

@Component({
  selector: 'app-brand-select-dialog',
  templateUrl: './brand-select-dialog.component.html',
  styleUrls: ['./brand-select-dialog.component.css']
})
export class BrandSelectDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;

  brands: Brand[] = [];

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
      fields: [
        { name: 'name', header: 'Name' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };



  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ){
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
  }

  ngOnInit(): void {
    this.loadData()
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
    dataListParameter.filterObj = filterObj;
    dataListParameter.searchQuery = searchQuery;
    this.brandService
      .getBrands(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.brands = res.data.brands;
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

  submit(res:Brand){
    this.ref.close(res);
  }
  onClose(){
    this.ref.close();
  }
}
