import { Component } from '@angular/core';
import {
  faChevronDown,
  faPencil,
  faPlus,
  faSquare,
  faSquareCheck,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SupplierQuotationSelectDialogComponent } from '@features/supplier-quotation/components/supplier-quotation-select-dialog/supplier-quotation-select-dialog.component';
import { PurchaseOrderWarehouseAddDialogComponent } from '../purchase-order-warehouse-add-dialog/purchase-order-warehouse-add-dialog.component';
import { SupplierQuotationService } from '@features/supplier-quotation/services/supplier-quotation.service';
import { SupplierQuotation } from '@features/supplier-quotation/interfaces/supplier-quotation';

@Component({
  selector: 'app-purchase-order-wizard-dialog',
  templateUrl: './purchase-order-wizard-dialog.component.html',
  styleUrls: ['./purchase-order-wizard-dialog.component.css'],
})
export class PurchaseOrderWizardDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;
  faSquare = faSquare;
  faSquareCheck = faSquareCheck;

  loading = false;
  title = '';

  purchaseOrderDetailForm: FormGroup;
  existingPurchaseOrderDetails: any;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private supplierQuotationService: SupplierQuotationService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    if (this.config.data.existingPurchaseOrderDetails) {
      this.existingPurchaseOrderDetails =
        this.config.data.existingPurchaseOrderDetails;
    }

    this.purchaseOrderDetailForm = new FormGroup({
      supplier_quotation: new FormControl(null, Validators.required),
      supplier_quotation_details: new FormArray([]),
    });
  }

  onSelectSupplierQuotation() {
    const ref = this.dialogService.open(
      SupplierQuotationSelectDialogComponent,
      {
        data: {
          title: 'Select Supplier Quotation',
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
    ref.onClose.subscribe((supplierQuotation) => {
      if (supplierQuotation) {
        this.loadSupplierQuotation(supplierQuotation.id);
        this.purchaseOrderDetailForm.controls['supplier_quotation'].setValue(
          supplierQuotation
        );
      }
    });
  }

  removeSupplierQuotation() {
    this.purchaseOrderDetailForm.controls['supplier_quotation'].setValue(null);
    this.purchaseOrderDetailForm.removeControl('supplier_quotation_details');
    this.purchaseOrderDetailForm.addControl(
      'supplier_quotation_details',
      new FormArray([])
    );
  }

  generateSupplierQuotationDetail(supplierQuotationDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(supplierQuotationDetail.id),
      exist: new FormControl(false),
      supplier_quotation: new FormControl(this.supplierQuotation),
      quotation_no: new FormControl(this.supplierQuotation.quotation_no),
      checked: new FormControl(false),
      product: new FormControl(supplierQuotationDetail.product),
      quantity: new FormControl(supplierQuotationDetail.quantity),
      price_per_unit: new FormControl(supplierQuotationDetail.price_per_unit),
      expected_delivery_date: new FormControl(
        supplierQuotationDetail.expected_delivery_date
      ),
      purchase_order_warehouses: new FormArray([], Validators.required),
    });
  }

  get supplierQuotationDetails(): FormArray {
    return this.purchaseOrderDetailForm.get(
      'supplier_quotation_details'
    ) as FormArray;
  }

  loadingSupplierQuotation = false;
  supplierQuotation!: SupplierQuotation;
  loadSupplierQuotation(id: string) {
    this.loadingSupplierQuotation = true;
    this.supplierQuotationService
      .getSupplierQuotation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loadingSupplierQuotation = false;
        this.supplierQuotation = res.data;
        this.supplierQuotation.supplier_quotation_id = this.supplierQuotation.id
        this.supplierQuotation.supplier_quotation_details.forEach(
          (data: any) => {
            this.supplierQuotationDetails.push(
              this.generateSupplierQuotationDetail(data)
            );
          }
        );

        this.supplierQuotationDetails.value.forEach((data: any, i: number) => {
          const isExist = this.existingPurchaseOrderDetails.find(
            (element: any) => {
              return element.product.id == data.product.id;
            }
          );
          if (isExist) {
            this.supplierQuotationDetails.at(i).patchValue({
              exist: true,
            });
          }
        });
      });
  }

  purchaseOrderWarehouses(index: number): FormArray {
    return this.supplierQuotationDetails
      .at(index)
      .get('purchase_order_warehouses') as FormArray;
  }

  addWarehouseDetail(index: number) {
    let existData = this.purchaseOrderWarehouses(index);
    const ref = this.dialogService.open(
      PurchaseOrderWarehouseAddDialogComponent,
      {
        data: {
          title: 'Add Purchase Warehouse Detail',
          existingWarehouse: existData.value,
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
        width: '350px',
      }
    );
    ref.onClose.subscribe((data) => {
      if (data) {
        this.purchaseOrderWarehouses(index).push(
          new FormGroup({
            warehouse: new FormControl(data.warehouse, Validators.required),
            quantity_ordered: new FormControl(
              data.quantity_ordered,
              Validators.required
            ),
          })
        );
      }
    });
  }

  removePurchaseWarehouseDetail(
    supplierQuotationIndex: number,
    warehouseIndex: number
  ) {
    this.purchaseOrderWarehouses(supplierQuotationIndex).removeAt(
      warehouseIndex
    );
  }

  onClose() {
    this.ref.close();
  }

  isSubmitAllowed(): boolean {
    // get checked supplier quotation details
    let checkedData: any = [];
    this.supplierQuotationDetails.value.filter((data: any, i: number) => {
      if (data.checked) {
        checkedData.push(this.supplierQuotationDetails.at(i));
      }
    });
    if (checkedData.length > 0) {
      let invalidData = checkedData.find((data: any) => {
        return data.invalid;
      });
      return invalidData ? false : true;
    } else {
      return false;
    }
  }

  submit() {
    let bodyReqForm: FormGroup;
    bodyReqForm = new FormGroup({
      purchase_order_details: new FormArray([]),
    });
    let purchaseOrderDetailArrayForm: any = bodyReqForm.get(
      'purchase_order_details'
    );


    this.supplierQuotationDetails.value.filter((data: any, i: number) => {
      if (data.checked) {
        purchaseOrderDetailArrayForm.push(this.supplierQuotationDetails.at(i));
      }
    });

    this.ref.close(purchaseOrderDetailArrayForm.value);
  }
}
