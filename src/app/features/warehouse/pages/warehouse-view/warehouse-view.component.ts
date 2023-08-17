import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import { faEye, faPlus, faSave, faTrash, faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { DataListParameter } from '@shared/components/fc-filter-dialog/interfaces/data-list-parameter.interface';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Inventory } from '@features/inventory/interfaces/inventory';
import { InventoryServices } from '@features/inventory/services/inventory.service';
import { InventoryTransactionsDialogComponent } from '@features/inventory/components/inventory-transactions-dialog/inventory-transactions-dialog.component';

@Component({
  selector: 'app-warehouse-view',
  templateUrl: './warehouse-view.component.html',
  styleUrls: ['./warehouse-view.component.css'],
})
export class WarehouseViewComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  // Icons
  faEye = faEye
  faTruckMoving = faTruckMoving
  faPlus = faPlus

  private destroy$: any = new Subject();
  warehouseForm: FormGroup;
  warehouse!: Warehouse;
  loading = false;
  warehouseId: any;

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
        this.softDelete();
      },
    },
  ];
  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [];

  constructor(
    private layoutService: LayoutService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryServices,
    private route: ActivatedRoute,
    private router: Router,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
  ) {
    this.warehouseId = String(this.route.snapshot.paramMap.get('id'));
    this.layoutService.setHeaderConfig({
      title: 'Warehouse Detail',
      icon: '',
      showHeader: true,
    });
    this.warehouseForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.warehouseService
      .getWarehouse(this.warehouseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.warehouse = res.data;
        this.loadInventories()
        this.warehouseForm.patchValue({
          code: this.warehouse.code,
          name: this.warehouse.name,
          location: this.warehouse.location,
        });
      });
  }

  inventories: Inventory[] = [];
  loadingInventory= false
  loadInventories() {
    this.loadingInventory = true
    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = 10;
    dataListParameter.page = 1;
    dataListParameter.filterObj = `warehouse_id=${this.warehouseId}&with_filter=1`;
    this.inventoryService.getInventories(dataListParameter).pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
      this.loadingInventory = false
      this.inventories = res.data.inventories;
    });
  }

  onSelectInventoryTransactions(id:number){
    // Open Dialog
    const ref = this.dialogService.open(InventoryTransactionsDialogComponent, {
      data: {
        title: 'Inventory Transactions',
        stockMovementId: id,
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
      }
    });
  }



  softDelete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this warehouse?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.warehouseService.softDeleteWarehouse(this.warehouseId).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.router.navigate(['/warehouse/list']);
            this.fcToastService.add({
              severity: 'success',
              header: 'Warehouse',
              message: res.message,
            });
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Warehouse',
              message: err.message,
            });
          },
        });
      },
    });
  }


  submit() {
    this.actionButtons[0].loading = true;
    this.warehouseService
      .updateWarehouse(this.warehouseId, this.warehouseForm.value)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'success',
            header: 'Warehouse',
            message: res.message,
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Warehouse',
            message: err.message,
          });
        },
      });
  }
}
