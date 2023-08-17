import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-supplier-bank-account-add-dialog',
  templateUrl: './supplier-bank-account-add-dialog.component.html',
  styleUrls: ['./supplier-bank-account-add-dialog.component.css'],
})
export class SupplierBankAccountAddDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  title = 'Add Supplier Bank Account';
  supplierBankAccountForm: FormGroup;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
    }
    this.supplierBankAccountForm = new FormGroup({
      account_no: new FormControl(''),
      bank: new FormControl(''),
      swift_code: new FormControl(''),
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
