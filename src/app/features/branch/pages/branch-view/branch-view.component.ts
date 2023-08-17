import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from '@features/branch/interfaces/branch.interface';
import { BranchService } from '@features/branch/services/branch.service';
import { CompanyAddDialogComponent } from '@features/company/components/company-add-dialog/company-add-dialog.component';
import {
  faBoxOpen,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCog,
  faLocationDot,
  faPlus,
  faRefresh,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.css'],
})
export class BranchViewComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  private destroy$: any = new Subject();

  // fontawesome
  faPlus = faPlus;
  faTrash = faTrash;
  faSave = faSave;
  faCog = faCog;
  faChevronDown = faChevronDown;
  faRefresh = faRefresh;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faBoxOpen = faBoxOpen;
  faLocationDot = faLocationDot;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      disabled: false,
      visible: true,
      action: () => {
        this.submit();
      },
    },
    {
      label: 'Delete',
      icon: faTrash,
      action: () => {
        this.softDelete();
      },
    },
  ];

  branchForm: FormGroup;
  branch!: Branch;
  companies: any;
  branchId: any;
  loading = false;

  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [];

  constructor(
    private layoutService: LayoutService,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService
  ) {
    this.branchId = String(this.route.snapshot.paramMap.get('id'));

    this.layoutService.setHeaderConfig({
      title: 'Branch Detail',
      icon: '',
      showHeader: true,
    });

    this.branchForm = new FormGroup({
      address: new FormControl(''),
      note: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  loadData() {
    this.loading = true;
    this.branchService
      .getBranch(this.branchId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.branch = res.data;
        this.companies = res.data.companies;
        this.branchForm.patchValue({
          address: this.branch.address,
          note: this.branch.note || '-',
        });
      });
  }

  onAddCompanies() {
    const ref = this.dialogService.open(CompanyAddDialogComponent, {
      data: {
        title: 'Add Company',
        branchId: this.branchId,
        currentCompanies: this.companies,
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
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.companies = newData;
      }
    });
  }

  navigateToCompany(companyId: any) {
    this.router.navigate(['/company/view/' + companyId]);
  }

  submit() {
    this.actionButtons[0].loading = true;
    this.branchService
      .updateBrach(this.branchId, this.branchForm.value)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'success',
            header: 'Branch',
            message: res.message,
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Branch',
            message: err.message,
          });
        },
      });
  }

  softDelete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this branch?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.branchService.softDeleteBranch(this.branchId).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.router.navigate(['/branch/list']);
            this.fcToastService.add({
              severity: 'success',
              header: 'Branch',
              message: res.message,
            });
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
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
}
