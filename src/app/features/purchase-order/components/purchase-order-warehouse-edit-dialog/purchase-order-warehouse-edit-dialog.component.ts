import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { WarehouseSelectDialogComponent } from '@features/warehouse/components/warehouse-select-dialog/warehouse-select-dialog.component';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import {
  faChevronDown,
  faL,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-order-warehouse-edit-dialog',
  templateUrl: './purchase-order-warehouse-edit-dialog.component.html',
  styleUrls: ['./purchase-order-warehouse-edit-dialog.component.css'],
})
export class PurchaseOrderWarehouseEditDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();

  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faSpinner = faSpinner;

  loading = false;
  title = '';
  purchaseOrderDetail: any;
  purchaseOrderId: any;
  purchaseOrderDetailId: any;
  purchaseOrderWarehouseId: any;

  purchaseOrderWarehouseForm: FormGroup;
  existingWarehouses: Warehouse[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private purchaseOrderService: PurchaseOrderService,
    private fcToastService: FcToastService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.purchaseOrderDetail) {
      this.purchaseOrderDetail = this.config.data.purchaseOrderDetail;
    }
    if (this.config.data.purchaseOrderId) {
      this.purchaseOrderId = this.config.data.purchaseOrderId;
    }
    if (this.config.data.purchaseOrderDetailId) {
      this.purchaseOrderDetailId = this.config.data.purchaseOrderDetailId;
    }
    if (this.config.data.purchaseOrderWarehouseId) {
      this.purchaseOrderWarehouseId = this.config.data.purchaseOrderWarehouseId;
    }

    // Existing Data
    if (this.config.data.existingWarehouse) {
      this.existingWarehouses = this.config.data.existingWarehouse;
    }

    this.purchaseOrderWarehouseForm = new FormGroup({
      warehouse: new FormControl(null, Validators.required),
      quantity_ordered: new FormControl(null, Validators.required),
    });

    if (this.config.data.purchaseOrderWarehouse) {
      let data = this.config.data.purchaseOrderWarehouse;
      this.purchaseOrderWarehouseForm.patchValue({
        id: data.id,
        warehouse: data.warehouse,
        quantity_ordered: data.quantity_ordered,
      });
    }
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onSelectWarehouse() {
    const ref = this.dialogService.open(WarehouseSelectDialogComponent, {
      data: {
        title: 'Select Waerhouse',
        existingWarehouse: this.existingWarehouses,
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
    ref.onClose.subscribe((warehouse) => {
      if (warehouse) {
        this.purchaseOrderWarehouseForm.controls['warehouse'].setValue(
          warehouse
        );
      }
    });
  }

  removeWarehouse() {
    this.purchaseOrderWarehouseForm.controls['warehouse'].setValue('');
  }

  isSubmitAllowed(): boolean {
    if (this.purchaseOrderWarehouseForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  onClose() {
    this.ref.close();
  }

  loadingButton = false;
  submit() {
    if (this.purchaseOrderDetail) {
      if (this.config.data.purchaseOrderWarehouse) {
        let bodyReqForm: FormGroup;
        bodyReqForm = new FormGroup({
          warehouse_id: new FormControl(
            this.purchaseOrderWarehouseForm.value.warehouse.id
          ),
          quantity_ordered: new FormControl(
            this.purchaseOrderWarehouseForm.value.quantity_ordered
          ),
        });
        this.purchaseOrderService
          .updatePurchaseOrderWarehouse(
            this.purchaseOrderId,
            this.purchaseOrderDetailId,
            this.purchaseOrderWarehouseId,
            bodyReqForm.value
          )
          .subscribe({
            next: (res: any) => {
              this.loadingButton = false;
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Order Warehouse',
                message: res.message,
              });
              this.ref.close(res.data);
            },
            error: (err) => {
              this.loadingButton = false;
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Order Warehouse',
                message: err.message,
              });
            },
          });
      } else {
        let bodyReqFormForAddWarehouse: FormGroup;
        bodyReqFormForAddWarehouse = new FormGroup({
          warehouse_id: new FormControl(
            this.purchaseOrderWarehouseForm.value.warehouse.id
          ),
          quantity_ordered: new FormControl(
            this.purchaseOrderWarehouseForm.value.quantity_ordered
          ),
        });
        this.purchaseOrderService
          .addPurchaseOrderWarehouse(
            this.purchaseOrderId,
            this.purchaseOrderDetailId,
            bodyReqFormForAddWarehouse.value
          )
          .subscribe({
            next: (res: any) => {
              this.loadingButton = false;
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Order Warehouse',
                message: res.message,
              });
              this.ref.close(res.data);
            },
            error: (err) => {
              this.loadingButton = false;
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Order Warehouse',
                message: err.message,
              });
            },
          });
      }
    } else {
      this.ref.close(this.purchaseOrderWarehouseForm.value);
    }
  }
}
