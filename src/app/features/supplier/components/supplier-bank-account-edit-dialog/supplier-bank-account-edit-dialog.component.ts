import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SupplierBankAccount } from '@features/supplier/interfaces/supplier';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-supplier-bank-account-edit-dialog',
  templateUrl: './supplier-bank-account-edit-dialog.component.html',
  styleUrls: ['./supplier-bank-account-edit-dialog.component.css'],
})
export class SupplierBankAccountEditDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  title = 'Add Supplier Bank Account';
  supplierBankAccountForm: FormGroup;
  supplierBankAccount: SupplierBankAccount = {} as SupplierBankAccount;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
      if (this.config.data.supplierBankAccount) {
        this.supplierBankAccount = this.config.data.supplierBankAccount;
      }
    }
    this.supplierBankAccountForm = new FormGroup({
      account_no: new FormControl(this.supplierBankAccount.account_no),
      bank: new FormControl(this.supplierBankAccount.bank),
      swift_code: new FormControl(this.supplierBankAccount.swift_code),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  submit() {
    this.ref.close(this.supplierBankAccountForm.value);
  }
  onClose() {
    this.ref.close();
  }
}
