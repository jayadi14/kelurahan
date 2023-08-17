import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  faChevronDown,
  faPencil,
  faPlus,
  faSpinner,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductSelectDialogComponent } from '@features/product/components/product-select-dialog/product-select-dialog.component';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { PurchaseOrderWarehouseEditDialogComponent } from '../purchase-order-warehouse-edit-dialog/purchase-order-warehouse-edit-dialog.component';
import { SupplierQuotationSelectDetailDialogComponent } from '@features/supplier-quotation/components/supplier-quotation-select-detail-dialog/supplier-quotation-select-detail-dialog.component';

@Component({
  selector: 'app-purchase-order-edit-detail',
  templateUrl: './purchase-order-edit-detail.component.html',
  styleUrls: ['./purchase-order-edit-detail.component.css'],
})
export class PurchaseOrderEditDetailComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPencil = faPencil;
  faTrash = faTrash;
  faPlus = faPlus;
  faSpinner = faSpinner;

  searchQuery: string = '';
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = '';
  purchaseOrderId: string = '';
  purchaseOrderDetailId: string = '';

  selectedProduct: any;
  selectedWarehouse: any;
  purchaseOrderDetailForm: FormGroup;
  existingPurchaseOrderDetails: any;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private fcToastService: FcToastService,
    private purchaseOrderService: PurchaseOrderService,
    private fcConfirmService: FcConfirmService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.purchaseOrderId) {
      this.purchaseOrderId = this.config.data.purchaseOrderId;
    }
    if (this.config.data.purchaseOrderDetailId) {
      this.purchaseOrderDetailId = this.config.data.purchaseOrderDetailId;
    }

    // Existing Data
    if (this.config.data.existingPurchaseOrderDetails) {
      this.existingPurchaseOrderDetails =
        this.config.data.existingPurchaseOrderDetails;
    }

    this.purchaseOrderDetailForm = new FormGroup({
      quotation_no: new FormControl('', Validators.required),
      supplier_quotation: new FormControl(null),
      product: new FormControl(null, Validators.required),
      price_per_unit: new FormControl(null, Validators.required),
      expected_delivery_date: new FormControl(null),
      purchase_order_warehouses: new FormArray([], Validators.required),
    });

    if (this.config.data.purchaseOrderDetail) {
      let data = this.config.data.purchaseOrderDetail;
      this.selectedProduct = data.product;
      this.purchaseOrderDetailForm.patchValue({
        quotation_no: data.quotation_no,
        supplier_quotation: data.supplier_quotation,
        product: data.product,
        price_per_unit: data.price_per_unit,
        expected_delivery_date: data.expected_delivery_date,
      });
      data.purchase_order_warehouses.forEach((data: any) => {
        this.purchaseOrderWarehouse.push(
          new FormGroup({
            id: new FormControl(data.id),
            warehouse: new FormControl(data.warehouse),
            quantity_ordered: new FormControl(data.quantity_ordered),
          })
        );
      });
    }
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  get purchaseOrderWarehouse(): FormArray {
    return this.purchaseOrderDetailForm.get(
      'purchase_order_warehouses'
    ) as FormArray;
  }

  isSubmitAllowed(): boolean {
    if (this.purchaseOrderDetailForm.valid && this.loadingButton == false) {
      return true;
    } else {
      return false;
    }
  }

  removeProduct() {
    this.selectedProduct = null;
    this.purchaseOrderDetailForm.controls['product'].setValue(null);
  }

  onSelectProduct() {
    let existProduct: any[] = [];
    // Push for Existing Product
    if (this.existingPurchaseOrderDetails.length > 0) {
      this.existingPurchaseOrderDetails.forEach((data: any) => {
        existProduct.push({
          product: data.product,
        });
      });
    } else {
      if (this.purchaseOrderDetailForm.value.product != null) {
        existProduct.push({
          product: this.purchaseOrderDetailForm.value.product,
        });
      }
    }

    const ref = this.dialogService.open(ProductSelectDialogComponent, {
      data: {
        title: 'Select Product',
        existingProduct: existProduct,
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
    ref.onClose.subscribe((product) => {
      if (product) {
        this.selectedProduct = product;
        this.purchaseOrderDetailForm.controls['product'].setValue(
          this.selectedProduct
        );
      }
    });
  }

  onSelectSupplierQuotation() {
    let existProduct: any[] = [];
    if (this.existingPurchaseOrderDetails.length > 0) {
      this.existingPurchaseOrderDetails.forEach((data: any) => {
        existProduct.push({
          product: data.product,
        });
      });
    }

    const ref = this.dialogService.open(
      SupplierQuotationSelectDetailDialogComponent,
      {
        data: {
          title: 'Select Supplier Quotation',
          existingProduct: existProduct,
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
        this.purchaseOrderDetailForm.controls['supplier_quotation'].setValue(
          supplierQuotation
        );

        this.purchaseOrderDetailForm.controls['quotation_no'].setValue(
          supplierQuotation.quotation_no
        );

        this.purchaseOrderDetailForm.controls['product'].setValue(
          supplierQuotation.product
        );

        this.purchaseOrderDetailForm.controls['price_per_unit'].setValue(
          supplierQuotation.price_per_unit
        );

        this.purchaseOrderDetailForm.controls[
          'expected_delivery_date'
        ].setValue(supplierQuotation.expected_delivery_date);
      }
    });
  }

  removeSupplierQuotation() {
    this.purchaseOrderDetailForm.controls['supplier_quotation'].setValue(null);
    this.purchaseOrderDetailForm.controls['quotation_no'].setValue(null);
    this.purchaseOrderDetailForm.controls['product'].setValue(null);
    this.purchaseOrderDetailForm.controls['price_per_unit'].setValue(null);
    this.purchaseOrderDetailForm.controls['expected_delivery_date'].setValue(
      null
    );
  }

  addWarehouseDetail() {
    const ref = this.dialogService.open(
      PurchaseOrderWarehouseEditDialogComponent,
      {
        data: {
          title: 'Add Purchase Warehouse Detail',
          existingWarehouse: this.purchaseOrderWarehouse.value,
          purchaseOrderDetail: this.config.data.purchaseOrderDetail,
          purchaseOrderId: this.purchaseOrderId,
          purchaseOrderDetailId: this.purchaseOrderDetailId,
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
        this.purchaseOrderWarehouse.push(
          new FormGroup({
            id: new FormControl(data.id),
            warehouse: new FormControl(data.warehouse),
            quantity_ordered: new FormControl(data.quantity_ordered),
          })
        );
      }
    });
  }

  editPurchaseWarehouseDetail(index: number, warehouseId: any) {
    const ref = this.dialogService.open(
      PurchaseOrderWarehouseEditDialogComponent,
      {
        data: {
          title: 'Edit Purchase Warehouse Detail',
          existingWarehouse: this.purchaseOrderWarehouse.value,
          purchaseOrderDetail: this.config.data.purchaseOrderDetail,
          purchaseOrderWarehouse: this.purchaseOrderWarehouse.value[index],
          purchaseOrderId: this.purchaseOrderId,
          purchaseOrderDetailId: this.purchaseOrderDetailId,
          purchaseOrderWarehouseId: warehouseId,
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
        this.purchaseOrderWarehouse.at(index).patchValue(data);
      }
    });
  }

  removePurchaseWarehouseDetail(index: number, warehouseId: any) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseOrderService
          .deletePurchaseOrderWarehouse(
            this.purchaseOrderId,
            this.purchaseOrderDetailId,
            warehouseId
          )
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Order Warehouse',
                message: res.message,
              });
              this.purchaseOrderWarehouse.removeAt(index);
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Order Warehouse',
                message: err.message,
              });
            },
          });
      },
    });
  }

  onClose() {
    this.ref.close();
  }

  loadingButton = false;
  submit() {
    this.loadingButton = true;
    // Update Purchase Order Detail
    if (this.config.data.purchaseOrderDetail) {
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        quotation_no: new FormControl(
          this.purchaseOrderDetailForm.value.quotation_no
        ),
        supplier_quotation_id: new FormControl(
          this.purchaseOrderDetailForm.value.supplier_quotation.supplier_quotation_id
        ),
        product_id: new FormControl(
          this.purchaseOrderDetailForm.value.product.id
        ),
        price_per_unit: new FormControl(
          this.purchaseOrderDetailForm.value.price_per_unit
        ),
        expected_delivery_date: new FormControl(
          this.purchaseOrderDetailForm.value.expected_delivery_date
        ),
      });
      this.purchaseOrderService
        .updatePurchaseOrderDetail(
          this.purchaseOrderId,
          bodyReqForm.value,
          this.purchaseOrderDetailId
        )
        .subscribe({
          next: (res: any) => {
            this.loadingButton = false;
            this.fcToastService.add({
              severity: 'success',
              header: 'Purchase Order Detail',
              message: res.message,
            });
            this.ref.close(this.purchaseOrderDetailForm.value);
          },
          error: (err) => {
            this.loadingButton = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Purchase Order Detail',
              message: err.message,
            });
          },
        });
    }
    // Create Purchase Order Detail
    else {
      let bodyReqFormForCreate: FormGroup;
      bodyReqFormForCreate = new FormGroup({
        quotation_no: new FormControl(
          this.purchaseOrderDetailForm.value.quotation_no
        ),
        supplier_quotation_id: new FormControl(
          this.purchaseOrderDetailForm.value.supplier_quotation.supplier_quotation_id
        ),
        product_id: new FormControl(
          this.purchaseOrderDetailForm.value.product.id
        ),
        price_per_unit: new FormControl(
          this.purchaseOrderDetailForm.value.price_per_unit
        ),
        expected_delivery_date: new FormControl(
          this.purchaseOrderDetailForm.value.expected_delivery_date
        ),
        purchase_order_warehouses: new FormArray([]),
      });
      let warehouseFormArray = bodyReqFormForCreate.get(
        'purchase_order_warehouses'
      ) as FormArray;
      this.purchaseOrderDetailForm.value.purchase_order_warehouses.forEach(
        (data: any) => {
          warehouseFormArray.push(
            new FormGroup({
              warehouse_id: new FormControl(data.warehouse.id),
              quantity_ordered: new FormControl(data.quantity_ordered),
            })
          );
        }
      );

      this.purchaseOrderService
        .addPurchaseOrderDetail(
          this.purchaseOrderId,
          bodyReqFormForCreate.value
        )
        .subscribe({
          next: (res: any) => {
            this.loadingButton = false;
            this.fcToastService.add({
              severity: 'success',
              header: 'Purchase Order Detail',
              message: res.message,
            });
            this.ref.close(res.data);
          },
          error: (err) => {
            this.loadingButton = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Purchase Order Detail',
              message: err.message,
            });
          },
        });
    }
  }
}
