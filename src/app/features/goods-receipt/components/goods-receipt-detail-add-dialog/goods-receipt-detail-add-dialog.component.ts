import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { ProductSelectDialogComponent } from '@features/product/components/product-select-dialog/product-select-dialog.component';
import { Product } from '@features/product/interfaces/product.interface';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';

@Component({
  selector: 'app-goods-receipt-detail-add-dialog',
  templateUrl: './goods-receipt-detail-add-dialog.component.html',
  styleUrls: ['./goods-receipt-detail-add-dialog.component.css']
})
export class GoodsReceiptDetailAddDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faSpinner = faSpinner;
  faChevronDown = faChevronDown

  loading = false;
  title = '';
  products: Product[] = [];
  allowedPOD: any
  selectedWarehouse!: Warehouse
  goodsReceiptDetailForm: FormGroup;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    if (this.config.data.products) {
      this.products = this.config.data.products;
    }

    if (this.config.data.allowedPOD) {
      this.allowedPOD = this.config.data.allowedPOD;
    }

    if (this.config.data.selectedWarehouse) {
      this.selectedWarehouse = this.config.data.selectedWarehouse;
    }

    this.goodsReceiptDetailForm = new FormGroup({
      product: new FormControl('', Validators.required),
      quantity: new FormControl(null, Validators.required),
    });

    if(this.config.data.goodsReceiptDetail){

      let data = this.config.data.goodsReceiptDetail;

      const selectedPOD = this.allowedPOD.find((value:any)=>{
        return value.product_id == data.product.id
      })

      const selectedPOW = selectedPOD.purchase_order_warehouses.find((value:any) =>{
       return value.warehouse_id == this.selectedWarehouse
      })

      this.quantityAllowed = selectedPOW.quantity_ordered - selectedPOW.quantity_received

      this.goodsReceiptDetailForm.patchValue({
        product: data.product,
        quantity: data.quantity,
      });
    }
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  quantityAllowed!: number
  onSelectProduct(){
    const ref = this.dialogService.open(ProductSelectDialogComponent, {
      data: {
        title: 'Select Product',
        products: this.products
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

      const selectedPOD = this.allowedPOD.find((value:any)=>{
        return value.product_id == product.id
      })

      const selectedPOW = selectedPOD.purchase_order_warehouses.find((value:any) =>{
       return value.warehouse_id == this.selectedWarehouse
      })

      this.quantityAllowed = selectedPOW.quantity_ordered - selectedPOW.quantity_received
      this.goodsReceiptDetailForm.controls['quantity'].setValue(this.quantityAllowed);

      if (product) {
        this.goodsReceiptDetailForm.controls['product'].setValue(product);
      }
    });
  }

  removeProduct(){
    this.goodsReceiptDetailForm.controls['product'].setValue('');
  }

  isSubmitAllowed(): boolean {
    if (this.goodsReceiptDetailForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  onClose(){
    this.ref.close();
  }

  submit() {
    if(this.goodsReceiptDetailForm.value.quantity > this.quantityAllowed){
      // Toast
      this.fcToastService.add({
        header: 'Goods Receipt',
        message: 'Max quantity allowed is ' + this.quantityAllowed + 'Pcs',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    } else{
      this.ref.close(this.goodsReceiptDetailForm.value);
    }
  }
}
