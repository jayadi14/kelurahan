import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseSelectDialogComponent } from '@features/warehouse/components/warehouse-select-dialog/warehouse-select-dialog.component';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';

@Component({
  selector: 'app-purchase-order-warehouse-add-dialog',
  templateUrl: './purchase-order-warehouse-add-dialog.component.html',
  styleUrls: ['./purchase-order-warehouse-add-dialog.component.css'],
})
export class PurchaseOrderWarehouseAddDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();

  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  loading = false;
  title = '';

  existingWarehouses: Warehouse[] = [];

  purchaseOrderWarehouseForm: FormGroup;
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

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

  submit() {
    this.ref.close(this.purchaseOrderWarehouseForm.value);
  }
}
