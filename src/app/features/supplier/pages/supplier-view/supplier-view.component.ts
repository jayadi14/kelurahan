import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SupplierBankAccountAddDialogComponent } from '@features/supplier/components/supplier-bank-account-add-dialog/supplier-bank-account-add-dialog.component';
import { SupplierBankAccountEditDialogComponent } from '@features/supplier/components/supplier-bank-account-edit-dialog/supplier-bank-account-edit-dialog.component';
import {
  Supplier,
  SupplierBankAccount,
} from '@features/supplier/interfaces/supplier';
import { SupplierService } from '@features/supplier/services/supplier.service';
import {
  faPencil,
  faPlus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-supplier-view',
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.css'],
})
export class SupplierViewComponent {
  private readonly destroy$ = new Subject<void>();

  faPlus = faPlus;
  faPencil = faPencil;
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
        this.delete();
      },
    },
  ];
  @Input() supplier: Supplier = {} as Supplier;
  @Input() quickView: Boolean = false;
  @Output() onDeleted = new EventEmitter();
  @Output() onUpdated = new EventEmitter();

  loading = true;

  supplierForm: FormGroup;
  confirmPassword: string = '';
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private location: Location,
    private supplierService: SupplierService,
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService,
    private dialogService: DialogService
  ) {
    this.supplier.id = String(this.route.snapshot.paramMap.get('supplierId'));

    this.layoutService.setHeaderConfig({
      title: 'Supplier',
      icon: '',
      showHeader: true,
    });
    // init form
    this.supplierForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl(''),
      contact_no: new FormControl(''),
      pic: new FormControl(''),
      tax_no: new FormControl(''),
      supplier_bank_accounts: new FormArray([]),
    });
  }
  ngOnInit(): void {
    if (!this.quickView) {
      this.loadData();
    }
  }
  ngOnChanges(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.supplierService.getSupplier(this.supplier.id).subscribe((res: any) => {
      this.supplier = res.data;
      this.supplierForm.patchValue({
        name: this.supplier.name,
        address: this.supplier.address,
        contact_no: this.supplier.contact_no,
        pic: this.supplier.pic,
        tax_no: this.supplier.tax_no,
      });
      this.supplier.supplier_bank_accounts.forEach(
        (supplierBankAcocunt: SupplierBankAccount) => {
          this.supplierBankAccounts.push(
            this.generateSupplierBankAccouns(supplierBankAcocunt)
          );
        }
      );
      this.loading = false;
    });
  }
  // Manage supplier bank accounts
  generateSupplierBankAccouns(
    supplierBankAccount: SupplierBankAccount
  ): FormGroup {
    return new FormGroup({
      id: new FormControl(supplierBankAccount.id),
      account_no: new FormControl(supplierBankAccount.account_no),
      bank: new FormControl(supplierBankAccount.bank),
      swift_code: new FormControl(supplierBankAccount.swift_code),
    });
  }
  get supplierBankAccounts(): FormArray {
    return this.supplierForm.get('supplier_bank_accounts') as FormArray;
  }
  addSupplierBankAccount() {
    const ref = this.dialogService.open(SupplierBankAccountAddDialogComponent, {
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
    ref.onClose.subscribe((supplierBankAccount) => {
      if (supplierBankAccount) {
        let bodyReq = JSON.parse(JSON.stringify(supplierBankAccount)); // deep copy

        this.supplierService
          .addSupplierBankAccount(this.supplier.id, bodyReq)
          .subscribe({
            next: (res: any) => {
              supplierBankAccount.id = res.data.id;
              this.supplierBankAccounts.push(
                this.generateSupplierBankAccouns(supplierBankAccount)
              );
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Supplier Bank Account has been added',
              });
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: err.message,
              });
            },
          });
      }
    });
  }
  editSupplierBankAccountDetail(index: number) {
    const ref = this.dialogService.open(
      SupplierBankAccountEditDialogComponent,
      {
        data: {
          title: 'Edit Purchase Payment Detail',
          supplierBankAccount: this.supplierBankAccounts.value[index],
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
    ref.onClose.subscribe((supplierBankAccount) => {
      if (supplierBankAccount) {
        let bodyReq = JSON.parse(JSON.stringify(supplierBankAccount)); // deep copy
        this.supplierService
          .updateSupplierBankAccount(
            this.supplier.id,
            this.supplierBankAccounts.value[index].id,
            bodyReq
          )
          .subscribe({
            next: (res: any) => {
              this.supplierBankAccounts
                .at(index)
                .patchValue(supplierBankAccount);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Supplier Bank Account has been updated',
              });
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: err.message,
              });
            },
          });
      }
    });
  }
  deleteSupplierBankAccountDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.supplierService
          .deleteSupplierBankAccount(
            this.supplier.id,
            this.supplierBankAccounts.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.supplierBankAccounts.removeAt(index);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Supplier Bank Account has been deleted',
              });
            },
          });
      },
    });
  }

  submit() {
    if (this.supplierForm.valid) {
      let bodyReq = JSON.parse(JSON.stringify(this.supplierForm.value)); // deep copy
      delete bodyReq.supplier_bank_accounts;
      this.actionButtons[0].loading = true;
      this.supplierService.updateSupplier(this.supplier.id, bodyReq).subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Supplier',
            message: res.message,
          });
          this.onUpdated.emit(res.data);
        },
        error: (err: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Supplier',
            message: err.message,
          });
        },
      });
    } else {
      this.fcToastService.clear();
      this.fcToastService.add({
        severity: 'error',
        header: 'Supplier',
        message: 'Please fill in all required fields',
      });
    }
  }
  delete() {
    this.fcConfirmService.open({
      message: 'Are you sure that you want to delete this supplier?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.supplierService.deleteSupplier(this.supplier.id).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Supplier',
              message: res.message,
            });
            if (this.quickView) {
              this.onDeleted.emit();
            } else {
              this.back();
            }
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'error',
              header: 'Supplier',
              message: err.message,
            });
          },
        });
      },
      key: 'confirmDialog',
    });
  }
  back() {
    this.location.back();
  }
}
