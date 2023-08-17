import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventorySelectDialogComponent } from '@features/inventory/components/inventory-select-dialog/inventory-select-dialog.component';
import { ProductSelectDialogComponent } from '@features/product/components/product-select-dialog/product-select-dialog.component';
import { StockMovementService } from '@features/stock-movement/services/stock-movement.service';
import { WarehouseSelectDialogComponent } from '@features/warehouse/components/warehouse-select-dialog/warehouse-select-dialog.component';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import {
  faChevronDown,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-stock-movement-add',
  templateUrl: './stock-movement-add.component.html',
  styleUrls: ['./stock-movement-add.component.css'],
})
export class StockMovementAddComponent {
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  private destroy$: any = new Subject();
  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,

      action: () => {
        this.submit();
      },
    },
  ];

  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [];

  stockMovementForm!: FormGroup;
  constructor(
    private layoutService: LayoutService,
    private stockMovementService: StockMovementService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private router: Router,
    private warehouseService: WarehouseService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Stock Movement',
      icon: '',
      showHeader: true,
    });
    this.stockMovementForm = new FormGroup({
      product: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      date: new FormControl(null, Validators.required),
      from_warehouse: new FormControl('', Validators.required),
      to_warehouse: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
      type: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onSelectWarehouseFrom() {
    let existingWarehouses: any[] = [];
    existingWarehouses.push({
      warehouse: this.stockMovementForm.value.to_warehouse,
    });
    const ref = this.dialogService.open(WarehouseSelectDialogComponent, {
      data: {
        title: 'Select Waerhouse',
        existingWarehouse: existingWarehouses,
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
        this.stockMovementForm.controls['from_warehouse'].setValue(warehouse);
        this.loadWarehouse(warehouse.id);
      }
    });
  }

  removeWarehouseFrom() {
    this.stockMovementForm.controls['from_warehouse'].setValue('');
    this.stockMovementForm.controls['product'].setValue('');
  }

  loadingWarehouse = false;
  warehouse!: Warehouse;
  loadWarehouse(warehouseId: string) {
    this.loadingWarehouse = true;
    this.warehouseService
      .getWarehouse(warehouseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.warehouse = res.data;
        this.loadingWarehouse = false;
      });
  }

  onSelectWarehouseTo() {
    let existingWarehouses: any[] = [];
    existingWarehouses.push({
      warehouse: this.stockMovementForm.value.from_warehouse,
    });
    const ref = this.dialogService.open(WarehouseSelectDialogComponent, {
      data: {
        title: 'Select Waerhouse',
        existingWarehouse: existingWarehouses,
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
        this.stockMovementForm.controls['to_warehouse'].setValue(warehouse);
      }
    });
  }

  removeWarehouseTo() {
    this.stockMovementForm.controls['to_warehouse'].setValue('');
  }

  allowedQuantity: any;
  onSelectProductInventory() {
    const ref = this.dialogService.open(InventorySelectDialogComponent, {
      data: {
        title: 'Select Product Inventory',
        inventories: this.warehouse.inventories,
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
    ref.onClose.subscribe((inventory) => {
      if (inventory) {
        this.stockMovementForm.controls['product'].setValue(inventory.product);
        this.allowedQuantity = inventory.quantity;
        this.stockMovementForm.controls['quantity'].setValue(
          inventory.quantity
        );
      }
    });
  }

  removeProductInventory() {
    this.stockMovementForm.controls['product'].setValue('');
    this.stockMovementForm.controls['quantity'].setValue('');
  }

  submit() {
    this.actionButtons[0].loading = true;
    if (this.stockMovementForm.valid) {
      if (this.stockMovementForm.value.quantity > this.allowedQuantity) {
        this.actionButtons[0].loading = false;
        // Toast
        this.fcToastService.add({
          header: 'Stock Movement',
          message: `Maximum Quantity is ${this.allowedQuantity}`,
          lottieOption: {
            path: '/assets/lotties/warning.json',
            loop: false,
          },
        });
      } else {
        let bodyReqForm: FormGroup;
        bodyReqForm = new FormGroup({
          product_id: new FormControl(this.stockMovementForm.value.product.id),
          quantity: new FormControl(this.stockMovementForm.value.quantity),
          date: new FormControl(this.stockMovementForm.value.date),
          from_id: new FormControl(
            this.stockMovementForm.value.from_warehouse.id
          ),
          to_id: new FormControl(this.stockMovementForm.value.to_warehouse.id),
          note: new FormControl(this.stockMovementForm.value.note),
          type: new FormControl(this.stockMovementForm.value.type),
        });
        this.stockMovementService
          .createStockMovement(bodyReqForm.value)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[0].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Stock Movement',
                message: res.message,
              });
              this.router.navigate(['/warehouse/view/', res.data.to_id]);
            },
            error: (err) => {
              this.actionButtons[0].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Stock Movement',
                message: err.message,
              });
            },
          });
      }
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
}
