import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '@features/brand/interfaces/brand';
import { BrandService } from '@features/brand/services/brand.service';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.component.html',
  styleUrls: ['./brand-view.component.css'],
})
export class BrandViewComponent implements OnInit, OnDestroy, AfterContentInit {
  private destroy$: any = new Subject();

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

  filterButtons: any[] = [];

  loading = false;
  brandForm: FormGroup;
  brand!: Brand;
  brandId: string;

  constructor(
    private layoutService: LayoutService,
    private brandService: BrandService,
    private messageService: MessageService,
    private fcToastService: FcToastService,
    private route: ActivatedRoute,
    private router: Router,
    private fcConfirmService: FcConfirmService,
    private confirmationService: ConfirmationService
  ) {
    this.brandId = String(this.route.snapshot.paramMap.get('id'));
    this.layoutService.setHeaderConfig({
      title: 'Brand Detail',
      icon: '',
      showHeader: true,
    });
    this.brandForm = new FormGroup({
      name: new FormControl(''),
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

  loadData() {
    this.loading = true;
    this.brandService
      .getBrand(this.brandId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.brand = res.data;
        this.brandForm.patchValue({
          name: this.brand.name,
        });
      });
  }

  submit() {
    this.actionButtons[0].loading = true;
    this.brandService
      .updateBrand(this.brandId, this.brandForm.value)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'success',
            header: 'Brand',
            message: res.message,
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Brand',
            message: err.message,
          });
        },
      });
  }

  softDelete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this brand?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.brandService.softDeleteBrand(this.brandId).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.router.navigate(['/brand/list']);
            this.fcToastService.add({
              severity: 'success',
              header: 'Brand',
              message: res.message,
            });
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Brand',
              message: err.message,
            });
          },
        });
      },
    });
  }
}
