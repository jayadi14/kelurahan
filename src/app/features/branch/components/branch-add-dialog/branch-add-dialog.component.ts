import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from '@features/branch/interfaces/branch.interface';
import { BranchService } from '@features/branch/services/branch.service';
import { CompanyService } from '@features/company/services/company.services';
import { faLocationDot, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-branch-add-dialog',
  templateUrl: './branch-add-dialog.component.html',
  styleUrls: ['./branch-add-dialog.component.css'],
})
export class BranchAddDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faLocationDot = faLocationDot;
  searchQuery: string = '';
  branches: Branch[] = [];
  currentBranch: any;
  companyId: any;

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
        { name: 'address', header: 'Address' },
        { name: 'note', header: 'Note' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private branchService: BranchService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private companyService: CompanyService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService
  ) {
    if (this.config.data.companyId) {
      this.companyId = this.config.data.companyId;
    }
    if (this.config.data.currentBranches) {
      this.currentBranch = this.config.data.currentBranches;
    }
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

    // end filter conditions
    // this.router.navigate(['.'], {
    //   relativeTo: this.route,
    //   queryParams: queryParams,
    //   replaceUrl: true,
    // });
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
    this.branchService
      .getBranches(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        let response = res.data.branches;
        this.loading = false;
        this.branches = response.map((data: any) => {
          let isExist = this.currentBranch.find((x: any) => x.id === data.id);
          if (isExist) {
            return { ...data, isExist: true };
          } else {
            return { ...data, isExist: false };
          }
        });
      });
  }

  search() {
    this.page = 1;
    this.loadData(this.page);
  }

  onSelectBranch(branch: Branch) {
    let reqData = new FormGroup({
      branches: new FormArray([
        new FormGroup({
          id: new FormControl(branch.id),
        }),
      ]),
    });
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to add this branch ?',
      accept: () => {
        this.companyService
          .assignCompanyToBranch(this.companyId, reqData.value)
          .subscribe({
            next: (res: any) => {
              this.ref.close(res.data.branches);
              this.fcToastService.add({
                severity: 'success',
                header: 'Branch',
                message: res.message,
              });
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Branch',
                message: err.message,
              });
            },
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
  onClose() {
    this.ref.close();
  }
}
