import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrencyExchangeRateAddDialogComponent } from '@features/currency/components/currency-exchange-rate-add-dialog/currency-exchange-rate-add-dialog.component';
import { CurrencyExchangeRateEditDialogComponent } from '@features/currency/components/currency-exchange-rate-edit-dialog/currency-exchange-rate-edit-dialog.component';
import {
  Currency,
  ExchangeRate,
} from '@features/currency/interfaces/currency.interface';
import { CurrencyService } from '@features/currency/services/currency.service';
import { ExchangeRateService } from '@features/currency/services/exchange-rate.service';
import {
  faPencil,
  faPlus,
  faRefresh,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-currency-view',
  templateUrl: './currency-view.component.html',
  styleUrls: ['./currency-view.component.css'],
})
export class CurrencyViewComponent {
  private destroy$: any = new Subject();
  faPencil = faPencil;
  faPlus = faPlus;
  faTrash = faTrash;

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
        this.onDeleteCurrency();
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

  currency: Currency = {} as Currency;
  currencyForm: FormGroup;
  loading = false;
  exchangeRateForm: FormGroup = new FormGroup({
    rate: new FormControl('', Validators.required),
    date: new FormControl(new Date(), Validators.required),
  });

  constructor(
    private layoutService: LayoutService,
    private location: Location,
    private currencyService: CurrencyService,
    private exchangeRateService: ExchangeRateService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private route: ActivatedRoute
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Currency Detail',
      icon: '',
      showHeader: true,
    });
    this.currencyForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
    this.route.params.subscribe((params: any) => {
      this.currency.id = params.id;
      this.currencyService
        .getCurrency(this.currency.id)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.currency = res.data;
            this.currencyForm.patchValue(this.currency);
          },
        });
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onAddExchangeRate() {
    const ref = this.dialogService.open(
      CurrencyExchangeRateAddDialogComponent,
      {
        data: {
          title: 'Add Exchange Rate',
          currency: this.currency,
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
      }
    );
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.currency.exchange_rates.push(newData);
      }
    });
  }
  onEditExchangeRate(exchangeRate: ExchangeRate, index: number) {
    const ref = this.dialogService.open(
      CurrencyExchangeRateEditDialogComponent,
      {
        data: {
          title: 'Edit Exchange Rate',
          currency: this.currency,
          exchangeRate: exchangeRate,
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
      }
    );
    ref.onClose.subscribe((editedData) => {
      if (editedData) {
        this.currency.exchange_rates[index] = editedData;
      }
    });
  }
  onDeleteExchangeRate(exchangeRate: ExchangeRate, index: number) {
    this.fcConfirmService.open({
      message: 'Are you sure that you want to delete this currency?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.exchangeRateService.deleteExchangeRate(exchangeRate.id).subscribe({
          next: (res: any) => {
            this.currency.exchange_rates.splice(index, 1);
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Exchange Rate',
              message: res.message,
            });
          },
          error: (err) => {
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'error',
              header: 'Exchange Rate',
              message: err.message,
            });
          },
        });
      },
      key: 'confirmDialog',
    });
  }

  onDeleteCurrency() {
    this.fcConfirmService.open({
      message: 'Are you sure that you want to delete this currency?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.currencyService.deleteCurrency(this.currency.id).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Currency',
              message: res.message,
            });
            this.location.back();
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'error',
              header: 'Currency',
              message: err.message,
            });
          },
        });
      },
      key: 'confirmDialog',
    });
  }

  submit() {
    this.actionButtons[0].loading = true;
    this.currencyService
      .updateCurrency(this.currency.id, this.currencyForm.value)
      .subscribe({
        next: (res: any) => {
          this.currency = res.data;
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Currency',
            message: res.message,
          });
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
  back() {
    this.location.back();
  }
}
