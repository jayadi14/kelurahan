import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { faArrowRight, faChevronDown, faEye, faPencil, faPlus, faRefresh, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { Router } from '@angular/router';
import { PurchaseReturnService } from '@features/purchase-return/services/purchase-return.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
import { PurchaseReturnAddDetailDialogComponent } from '@features/purchase-return/components/purchase-return-add-detail-dialog/purchase-return-add-detail-dialog.component';

@Component({
  selector: 'app-purchase-return-add',
  templateUrl: './purchase-return-add.component.html',
  styleUrls: ['./purchase-return-add.component.css']
})
export class PurchaseReturnAddComponent {
  private destroy$: any = new Subject();
    // Icons
    faTimes = faTimes
    faChevronDown = faChevronDown
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
    ];

  loading = false
  purchaseReturnForm: FormGroup;

  constructor(
    private layoutService: LayoutService,
    private purchaseReturnService: PurchaseReturnService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router,
  ){
    this.layoutService.setHeaderConfig({
      title: 'Add Purchase Return',
      icon: '',
      showHeader: true,
    });
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
  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  get purchaseReturnDetails(): FormArray {
    return this.purchaseReturnForm.get(
      'purchase_return_details'
    ) as FormArray;
  }

  generatePurchaseReturnDetails(purchaseReturnDetail: any): FormGroup {
    return new FormGroup({
      purchaseable: new FormControl(
        purchaseReturnDetail.purchaseable
      ),
      quantity: new FormControl(
        purchaseReturnDetail.quantity
      ),
      amount: new FormControl(
        purchaseReturnDetail.amount
      ),
    });
  }

  changeDestination(){
    this.purchaseReturnForm.removeControl('purchase_return_details');
    this.purchaseReturnForm.addControl('purchase_return_details', new FormArray([]));
  }

  removeDestination(){
    this.purchaseReturnForm.controls['destination'].setValue(null);
    this.purchaseReturnForm.removeControl('purchase_return_details');
    this.purchaseReturnForm.addControl('purchase_return_details', new FormArray([]));
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
        this.purchaseReturnForm.controls['supplier'].setValue(
          supplier
        );
      }
    });
  }

  onAddPurchaseReturnDetail(){
    // Open Dialog
    const ref = this.dialogService.open(PurchaseReturnAddDetailDialogComponent, {
      data: {
        title: 'Add Purchase Return Detail',
        destination: this.purchaseReturnForm.value.destination
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
    ref.onClose.subscribe((purchaseReturnDetail) => {
      if (purchaseReturnDetail) {
        this.purchaseReturnDetails.push(
          this.generatePurchaseReturnDetails(purchaseReturnDetail)
        );
      }
    });
  }

  onEditPurchaseReturnDetail(index: number){
    // Open Dialog
    const ref = this.dialogService.open(PurchaseReturnAddDetailDialogComponent, {
      data: {
        title: 'Edit Purchase Return Detail',
        purchaseReturnDetail: this.purchaseReturnDetails.value[index],
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
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.purchaseReturnDetails.controls[index].patchValue(newData);
      }
    });
  }

  onRemovePurchaseReturnDetail(index: number){
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseReturnDetails.removeAt(index);
      },
    });
  }

  submit(){
    if(this.purchaseReturnForm.valid){
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        purchase_return_no: new FormControl(
          (this.purchaseReturnForm.value.purchase_return_no)
        ),
        destination: new FormControl(
          (this.purchaseReturnForm.value.destination)
        ),
        date: new FormControl(
          (this.purchaseReturnForm.value.date)
        ),
        note: new FormControl(
          (this.purchaseReturnForm.value.note)
        ),
        type: new FormControl(
          (this.purchaseReturnForm.value.type)
        ),
        supplier_id: new FormControl(
          (this.purchaseReturnForm.value.supplier.id)
        ),
        purchase_return_details: new FormArray([]),
      })
      if(this.purchaseReturnForm.value.purchase_return_details){
        let purchaseReturnDetailArray: any = bodyReqForm.get('purchase_return_details');
        this.purchaseReturnForm.value.purchase_return_details.forEach((data: any) => {
          let fg = new FormGroup({
            purchaseable_id: new FormControl(data.purchaseable.id),
            quantity: new FormControl(data.quantity),
            amount: new FormControl(data.amount),
          })
          purchaseReturnDetailArray.push(fg)
        })
      }

      this.purchaseReturnService.addPurchaseReturn(bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Return',
            message: res.message,
          });
          this.router.navigate(['/purchase-return/view/', res.data.id]);
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
    }else {
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

}
