import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '@features/company/services/company.services';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.css'],
})
export class CompanyAddComponent
  implements OnInit, OnDestroy, AfterContentInit
{
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

  companyForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private companyService: CompanyService,
    private fcToastService: FcToastService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Company',
      icon: '',
      showHeader: true,
    });
    this.companyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      note: new FormControl(''),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  submit() {
    if (this.companyForm.valid) {
      this.actionButtons[0].loading = true;
      this.companyService.addCompany(this.companyForm.value).subscribe({
        next: (res: any) => {
          this.companyForm.reset();
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
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Company',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }
}
