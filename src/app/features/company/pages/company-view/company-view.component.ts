import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchAddDialogComponent } from '@features/branch/components/branch-add-dialog/branch-add-dialog.component';
import { Company } from '@features/company/interfaces/company.interface';
import { CompanyService } from '@features/company/services/company.services';
import {
  faBoxOpen,
  faEye,
  faLocationDot,
  faPlus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css'],
})
export class CompanyViewComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  private destroy$: any = new Subject();

  // icon
  faLocationDot = faLocationDot;
  faPlus = faPlus;
  faEye = faEye;
  faBoxOpen = faBoxOpen;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
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

  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [];

  companyForm: FormGroup;
  company!: Company;
  loading = false;
  companyId: string;

  constructor(
    private layoutService: LayoutService,
    private companyService: CompanyService,
    private fcToastService: FcToastService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService
  ) {
    this.companyId = String(this.route.snapshot.paramMap.get('id'));

    this.layoutService.setHeaderConfig({
      title: 'Company Detail',
      icon: '',
      showHeader: true,
    });
    this.companyForm = new FormGroup({
      name: new FormControl(''),
      note: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  branches: any;
  loadData() {
    this.loading = true;
    this.companyService
      .getCompany(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.company = res.data;
        this.branches = this.company.branches;
        this.companyForm.patchValue({
          name: this.company.name,
          note: this.company.note || '-',
        });
      });
  }

  onAddBranch() {
    const ref = this.dialogService.open(BranchAddDialogComponent, {
      data: {
        title: 'Add Branch',
        companyId: this.companyId,
        currentBranches: this.branches,
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
        this.branches = newData;
      }
    });
  }

  submit() {
    this.actionButtons[0].loading = true;
    this.companyService
      .updateCompany(this.companyId, this.companyForm.value)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'success',
            header: 'Company',
            message: res.message,
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Company',
            message: err.message,
          });
        },
      });
  }

  softDelete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this company?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.companyService.softDeleteCompany(this.companyId).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.router.navigate(['/company/list']);
            this.fcToastService.add({
              severity: 'success',
              header: 'Company',
              message: res.message,
            });
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Company',
              message: err.message,
            });
          },
        });
      },
    });
  }

  navigateToBranch(branch: any) {
    this.router.navigate(['/branch/view/' + branch]);
  }
}
