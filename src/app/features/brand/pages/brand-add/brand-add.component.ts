import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '@features/brand/services/brand.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css'],
})
export class BrandAddComponent implements OnInit, OnDestroy, AfterContentInit {
  private destroy$: any = new Subject();

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,

      action: () => {
        this.submit();
      },
    },
  ];
  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [];

  loading = false;
  brandForm: FormGroup;

  constructor(
    private layoutService: LayoutService,
    private brandService: BrandService,
    private fcToastService: FcToastService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Brand',
      icon: '',
      showHeader: true,
    });
    this.brandForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  submit() {
    if (this.brandForm.valid) {
      this.actionButtons[0].loading = true;
      this.brandService.addBrand(this.brandForm.value).subscribe({
        next: (res: any) => {
          this.brandForm.reset();
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
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Brand',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }
}
