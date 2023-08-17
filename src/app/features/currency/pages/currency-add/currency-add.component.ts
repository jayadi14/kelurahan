import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '@features/currency/services/currency.service';
import { faRefresh, faSave } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-currency-add',
  templateUrl: './currency-add.component.html',
  styleUrls: ['./currency-add.component.css'],
})
export class CurrencyAddComponent {
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
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {},
    },
  ];

  currencyForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private currencyService: CurrencyService,
    private fcToastService: FcToastService,
    private location: Location
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Currency',
      icon: '',
      showHeader: true,
    });
    this.currencyForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  back() {
    this.location.back();
  }
  submit() {
    this.actionButtons[0].loading = true;
    this.currencyService.addCurrency(this.currencyForm.value).subscribe({
      next: (res: any) => {
        this.currencyForm.reset();
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Currency',
          message: res.message,
        });
        this.back();
      },
      error: (err) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'Currency',
          message: err.message,
        });
      },
    });
  }
}
