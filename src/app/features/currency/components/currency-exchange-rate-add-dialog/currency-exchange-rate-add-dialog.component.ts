import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Currency,
  ExchangeRate,
} from '@features/currency/interfaces/currency.interface';
import { ExchangeRateService } from '@features/currency/services/exchange-rate.service';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-currency-exchange-rate-add-dialog',
  templateUrl: './currency-exchange-rate-add-dialog.component.html',
  styleUrls: ['./currency-exchange-rate-add-dialog.component.css'],
})
export class CurrencyExchangeRateAddDialogComponent {
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faSpinner = faSpinner;

  title = 'Add Exchange Rate';
  exchangeRate: ExchangeRate = {} as ExchangeRate;
  currency: Currency = {} as Currency;
  exchangeRateForm: FormGroup;
  loading = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private exchangeRateService: ExchangeRateService
  ) {
    if (this.config.data.exchangeRate) {
      this.exchangeRate = this.config.data.exchangeRate;
    }
    if (this.config.data.currency) {
      this.currency = this.config.data.currency;
    }
    this.exchangeRate = this.config.data.exchangeRate;
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    this.exchangeRateForm = new FormGroup({
      currency_id: new FormControl(this.currency.id, Validators.required),
      rate: new FormControl('', Validators.required),
      date: new FormControl(new Date(), Validators.required),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onClose() {
    this.ref.close();
  }
  submit() {
    this.loading = true;
    this.exchangeRateService
      .addExchangeRate(this.exchangeRateForm.value)
      .subscribe((res: any) => {
        this.ref.close(res.data);
      });
  }
}
