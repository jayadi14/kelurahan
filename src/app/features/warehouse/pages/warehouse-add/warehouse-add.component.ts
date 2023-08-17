import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-warehouse-add',
  templateUrl: './warehouse-add.component.html',
  styleUrls: ['./warehouse-add.component.css'],
})
export class WarehouseAddComponent
  implements OnInit, OnDestroy, AfterContentInit
{
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

  warehouseForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private warehouseService: WarehouseService,
    private fcToastService: FcToastService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Warehouse',
      icon: '',
      showHeader: true,
    });
    this.warehouseForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  submit() {
    if (this.warehouseForm.valid) {
      this.actionButtons[0].loading = true;
      this.warehouseService.addWarehouse(this.warehouseForm.value).subscribe({
        next: (res: any) => {
          this.warehouseForm.reset();
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
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Warehouse',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }
}
