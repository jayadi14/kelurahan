import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseReturnEditDetailDialogComponent } from '@features/purchase-return/components/purchase-return-edit-detail-dialog/purchase-return-edit-detail-dialog.component';
import { PurchaseReturn } from '@features/purchase-return/interfaces/purchase-return';
import { PurchaseReturnService } from '@features/purchase-return/services/purchase-return.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
import {
  faArrowRight,
  faCheck,
  faChevronDown,
  faEye,
  faPencil,
  faPlus,
  faRefresh,
  faSave,
  faTimes,
  faTrash,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-return-view',
  templateUrl: './purchase-return-view.component.html',
  styleUrls: ['./purchase-return-view.component.css'],
})
export class PurchaseReturnViewComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowRight = faArrowRight;

  purchaseReturnDestination: any = [
    {
      id: 0,
      name: 'Goods Receipt',
    },
    {
      id: 1,
      name: 'Purchase Invoice',
    },
  ];

  purchaseReturnTypes: any = [
    {
      id: 0,
      name: 'Return',
    },
    {
      id: 1,
      name: 'Refund',
    },
  ];

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
    {
      label: 'Complete',
      icon: faCheck,
      action: () => {
        this.setPurchaseReturnAsComplete();
      },
    },
    {
      label: 'Cancel',
      icon: faX,
      action: () => {
        this.setPurchaseReturnAsCancel();
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
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {
        this.refresh();
      },
    },
  ];
  loading = false;
  purchaseReturnForm: FormGroup;
  purchaseReturn!: PurchaseReturn;
  purchaseReturnId: string = '';

  constructor(
    private layoutService: LayoutService,
    private purchaseReturnService: PurchaseReturnService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.purchaseReturnId = String(this.route.snapshot.paramMap.get('id'));

    this.purchaseReturnForm = new FormGroup({
      purchase_return_no: new FormControl(null, Validators.required),
      destination: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      note: new FormControl(null),
      type: new FormControl(null, Validators.required),
      supplier: new FormControl(null, Validators.required),
      purchase_return_details: new FormArray([]),
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  loadData() {
    this.loading = true;
    this.purchaseReturnService
      .getPurchaseReturn(this.purchaseReturnId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.purchaseReturn = res.data;

        this.generateActionButtons();
        this.generateHeader();

        this.purchaseReturnForm.patchValue({
          purchase_return_no: this.purchaseReturn.purchase_return_no,
          destination: this.purchaseReturn.destination,
          date: this.purchaseReturn.date,
          note: this.purchaseReturn.note,
          type: this.purchaseReturn.type,
          supplier: this.purchaseReturn.supplier,
        });

        this.purchaseReturn.purchase_return_details.forEach((data: any) => {
          this.purchaseReturnDetails.push(
            this.generatePurchaseReturnDetails(data)
          );
        });
      });
  }
  generateActionButtons() {
    this.actionButtons.forEach((actionButton) => {
      actionButton.hidden = true;
    });
    switch (this.purchaseReturn.status) {
      case 0: // draft
        this.actionButtons[0].hidden = false;
        this.actionButtons[1].hidden = false;
        this.actionButtons[2].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      case 1: // completed
        this.actionButtons[0].hidden = false;
        break;
      case 2: // cancelled
        break;
      default:
        break;
    }
  }
  generateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Purchase Return (${this.purchaseReturn.status_name})`,
      icon: '',
      showHeader: true,
    });
  }

  get purchaseReturnDetails(): FormArray {
    return this.purchaseReturnForm.get('purchase_return_details') as FormArray;
  }

  generatePurchaseReturnDetails(purchaseReturnDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(purchaseReturnDetail.id),
      purchaseable: new FormControl(purchaseReturnDetail.purchaseable),
      quantity: new FormControl(purchaseReturnDetail.quantity),
      amount: new FormControl(purchaseReturnDetail.amount),
    });
  }

  changeDestination() {
    this.purchaseReturnForm.removeControl('purchase_return_details');
    this.purchaseReturnForm.addControl(
      'purchase_return_details',
      new FormArray([])
    );
  }

  removeDestination() {
    this.purchaseReturnForm.controls['destination'].setValue(null);
    this.purchaseReturnForm.removeControl('purchase_return_details');
    this.purchaseReturnForm.addControl(
      'purchase_return_details',
      new FormArray([])
    );
  }

  removeSupplier() {
    this.purchaseReturnForm.controls['supplier'].setValue('');
  }

  onSelectSupplier() {
    const ref = this.dialogService.open(SupplierSelectDialogComponent, {
      data: {
        title: 'Select Supplier',
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
    ref.onClose.subscribe((supplier) => {
      if (supplier) {
        this.purchaseReturnForm.controls['supplier'].setValue(supplier);
      }
    });
  }

  onAddPurchaseReturnDetail() {
    // Open Dialog
    const ref = this.dialogService.open(
      PurchaseReturnEditDetailDialogComponent,
      {
        data: {
          title: 'Add Purchase Return Detail',
          destination: this.purchaseReturnForm.value.destination,
          purchaseReturnId: this.purchaseReturnId,
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
    ref.onClose.subscribe((purchaseReturnDetail) => {
      if (purchaseReturnDetail) {
        this.purchaseReturnDetails.push(
          this.generatePurchaseReturnDetails(purchaseReturnDetail)
        );
      }
    });
  }

  onEditPurchaseReturnDetail(purchaseReturnDetailId: string, index: number) {
    // Open Dialog
    const ref = this.dialogService.open(
      PurchaseReturnEditDetailDialogComponent,
      {
        data: {
          title: 'Edit Purchase Return Detail',
          purchaseReturnDetail: this.purchaseReturnDetails.value[index],
          purchaseReturnId: this.purchaseReturnId,
          purchaseReturnDetailId: purchaseReturnDetailId,
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
        this.purchaseReturnDetails.controls[index].patchValue(newData);
      }
    });
  }

  onRemovePurchaseReturnDetail(purchaseReturnDetailId: string, index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseReturnService
          .deletePurchaseReturnDetail(
            this.purchaseReturnId,
            purchaseReturnDetailId
          )
          .subscribe({
            next: (res: any) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Return Detail',
                message: res.message,
              });
              this.purchaseReturnDetails.removeAt(index);
            },
            error: (err) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Return Detail',
                message: err.message,
              });
            },
          });
      },
    });
  }

  delete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this purchase return ?',
      accept: () => {
        this.actionButtons[3].loading = true;
        this.purchaseReturnService
          .deletePurchaseReturn(this.purchaseReturnId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[3].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Return',
                message: res.message,
              });
              this.router.navigate(['/purchase-return/list']);
            },
            error: (err) => {
              this.actionButtons[3].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Return',
                message: err.message,
              });
            },
          });
      },
    });
  }

  setPurchaseReturnAsCancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to set this purchase return as cancel ?',
      accept: () => {
        this.actionButtons[2].loading = true;
        this.purchaseReturnService
          .setStatusAsCancel(this.purchaseReturnId)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Return',
                message: res.message,
              });
              this.purchaseReturn.status_name = res.data.status_name;
              this.purchaseReturn.status = res.data.status;
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err) => {
              this.actionButtons[2].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Return',
                message: err.message,
              });
            },
          });
      },
    });
  }

  setPurchaseReturnAsComplete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to set this purchase return as complete ?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.purchaseReturnService
          .setStatusAsComplete(this.purchaseReturnId)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Return',
                message: res.message,
              });
              this.purchaseReturn.status_name = res.data.status_name;
              this.purchaseReturn.status = res.data.status;
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err) => {
              this.actionButtons[1].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Return',
                message: err.message,
              });
            },
          });
      },
    });
  }

  submit() {
    this.actionButtons[0].loading = true;
    if (this.purchaseReturnForm.valid) {
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        purchase_return_no: new FormControl(
          this.purchaseReturnForm.value.purchase_return_no
        ),
        date: new FormControl(this.purchaseReturnForm.value.date),
        note: new FormControl(this.purchaseReturnForm.value.note),
      });

      this.purchaseReturnService
        .updatePurchaseReturn(this.purchaseReturnId, bodyReqForm.value)
        .subscribe({
          next: (res: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Purchase Return',
              message: res.message,
            });
            this.purchaseReturn.status = res.data.status;
            this.purchaseReturn.status_name = res.data.status_name;
            this.generateActionButtons();
            this.generateHeader();
          },
          error: (err) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'error',
              header: 'Purchase Return',
              message: err.message,
            });
          },
        });
    } else {
      this.actionButtons[0].loading = false;
      // Toast
      this.fcToastService.add({
        header: 'Goods Receipt',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }
  refresh() {
    this.purchaseReturnForm.removeControl('purchase_return_details');
    this.purchaseReturnForm.addControl(
      'purchase_return_details',
      new FormArray([])
    );
    this.loadData();
  }
}
