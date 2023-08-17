import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandSelectDialogComponent } from '@features/brand/components/brand-select-dialog/brand-select-dialog.component';
import { Brand } from '@features/brand/interfaces/brand';
import { ProductCategorySelectDialogComponent } from '@features/product-category/components/product-category-select-dialog/product-category-select-dialog.component';
import { ProductCategory } from '@features/product-category/interfaces/product-category';
import { Product } from '@features/product/interfaces/product.interface';
import { ProductService } from '@features/product/services/product.service';
import {
  faCheck,
  faChevronDown,
  faCloudArrowUp,
  faSave,
  faSpinner,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
})
export class ProductViewComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  // Icons
  faCloudArrowUp = faCloudArrowUp;
  faCheck = faCheck;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  private destroy$: any = new Subject();
  productForm: FormGroup;
  product!: Product;
  loading = false;
  productId: any;
  selectedCategory!: ProductCategory | null;
  selectedBrand!: Brand | null;
  selectedDefaultImage: any;

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

  productType: any = [
    {
      id: 0,
      name: 'Serialized',
    },
    {
      id: 1,
      name: 'Unserialized',
    },
  ];

  productStatus: any = [
    {
      id: 0,
      name: 'Status1',
    },
  ];

  productValuationMethod: any = [
    {
      id: 0,
      name: 'LIFO',
    },
    {
      id: 0,
      name: 'FIFO',
    },
  ];

  constructor(
    private layoutService: LayoutService,
    private productService: ProductService,
    private fcToastService: FcToastService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService
  ) {
    this.productId = String(this.route.snapshot.paramMap.get('id'));

    this.layoutService.setHeaderConfig({
      title: 'Product Detail',
      icon: '',
      showHeader: true,
    });
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      base_price: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      valuation_method: new FormControl('', Validators.required),
      product_category_id: new FormControl('', Validators.required),
      brand_id: new FormControl('', Validators.required),
      // quantity: new FormControl('', Validators.required),
      product_images: new FormArray([], Validators.required),
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
    this.productService
      .getProduct(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.product = res.data;
        this.selectedBrand = this.product.brand;
        this.selectedCategory = this.product.product_category;
        this.productForm.patchValue({
          name: this.product.name,
          description: this.product.description,
          type: this.product.type,
          base_price: this.product.base_price,
          status: this.product.status,
          valuation_method: this.product.valuation_method,
          product_category_id: this.product.product_category_id,
          brand_id: this.product.brand_id,
          // quantity: this.product.quantity,
        });
        if (this.product.product_images) {
          let imageArrayForm: any = this.productForm.get('product_images');
          this.product.product_images.forEach((image: any) => {
            imageArrayForm.push(
              new FormGroup({
                id: new FormControl(image.id),
                is_default: new FormControl(image.is_default),
                sequence: new FormControl(image.sequence),
                url: new FormControl(image.url),
              })
            );
          });
        }
      });
  }

  onSelectProductCategory() {
    const ref = this.dialogService.open(ProductCategorySelectDialogComponent, {
      data: {
        title: 'Select Product Category',
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
      width: '600px',
    });
    ref.onClose.subscribe((category) => {
      if (category) {
        this.selectedCategory = category;
        this.productForm.controls['product_category_id'].setValue(
          this.selectedCategory?.id
        );
      }
    });
  }

  onSelectProductBrand() {
    const ref = this.dialogService.open(BrandSelectDialogComponent, {
      data: {
        title: 'Select Product Brand',
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
    ref.onClose.subscribe((brand) => {
      if (brand) {
        this.selectedBrand = brand;
        this.productForm.controls['brand_id'].setValue(this.selectedBrand?.id);
      }
    });
  }

  removeCategory() {
    this.selectedCategory = null;
    this.productForm.controls['product_category_id'].setValue('');
  }

  removeBrand() {
    this.selectedBrand = null;
    this.productForm.controls['brand_id'].setValue('');
  }

  loadingAddImage = false;
  addMultipleImage(images: any) {
    this.loadingAddImage = true;
    let fd: FormData = new FormData();
    images.forEach((image: any, i: number) => {
      fd.append(`product_images[${i}][file]`, image.file);
      fd.append(`product_images[${i}][is_default]`, 'false');
    });

    this.productService.addProductImage(this.productId, fd).subscribe({
      next: (res: any) => {
        this.loadingAddImage = false;
        this.fcToastService.add({
          severity: 'success',
          header: 'Product Image',
          message: res.message,
        });
        // init productimage to form
        let imageArrayForm: any = this.productForm.get('product_images');
        const currentIds = imageArrayForm.value.map((image: any) => image.id);
        const newImages = res.data.product_images.filter(
          (value: any) => !currentIds.includes(value.id)
        );
        newImages.forEach((image: any) => {
          imageArrayForm.push(
            new FormGroup({
              id: new FormControl(image.id),
              is_default: new FormControl(image.is_default),
              sequence: new FormControl(image.sequence),
              url: new FormControl(image.url),
            })
          );
        });
      },
      error: (err) => {
        this.loadingAddImage = false;
        this.fcToastService.add({
          severity: 'error',
          header: 'Product Image',
          message: err.message,
        });
      },
    });
  }

  onUpdateDefaultImage(image: any) {
    let reqData = new FormGroup({
      product_images: new FormArray([
        new FormGroup({
          id: new FormControl(image.id),
          sequence: new FormControl(image.sequence),
          is_default: new FormControl(true),
        }),
      ]),
    });

    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure that you want make this product image default?',
      accept: () => {
        this.productService
          .updateProductImage(this.productId, reqData.value)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Product Image',
                message: res.message,
              });
              // init productimage to form
              this.productForm.removeControl('product_images');
              this.productForm.addControl('product_images', new FormArray([]));
              let imageArrayForm: any = this.productForm.get('product_images');
              let newImageData = res.data.product_images;
              newImageData.forEach((image: any) => {
                imageArrayForm.push(
                  new FormGroup({
                    id: new FormControl(image.id),
                    is_default: new FormControl(image.is_default),
                    sequence: new FormControl(image.sequence),
                    url: new FormControl(image.url),
                  })
                );
              });
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Product Image',
                message: err.message,
              });
            },
          });
      },
    });
  }

  get imagesArrayForm(): FormArray {
    return this.productForm.get('product_images') as FormArray;
  }

  softDeleteProductImage(image: any, index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this product image?',
      accept: () => {
        this.productService
          .softDeleteProductImage(this.productId, image.id)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Product Image',
                message: res.message,
              });
              this.imagesArrayForm.removeAt(index);
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Product Image',
                message: err.message,
              });
            },
          });
      },
    });
  }

  submit() {
    let bodyReq = structuredClone(this.productForm.value);
    delete bodyReq.product_images;
    this.actionButtons[0].loading = true;
    this.productService.updateProduct(this.productId, bodyReq).subscribe({
      next: (res: any) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.add({
          severity: 'success',
          header: 'Product',
          message: res.message,
        });
      },
      error: (err) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.add({
          severity: 'error',
          header: 'Product',
          message: err.message,
        });
      },
    });
  }

  softDelete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this product ?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.productService.softDeleteProduct(this.productId).subscribe({
          next: (res: any) => {
            this.actionButtons[1].loading = false;
            this.router.navigate(['/product/list']);
            this.fcToastService.add({
              severity: 'success',
              header: 'Product',
              message: res.message,
            });
          },
          error: (err) => {
            this.actionButtons[1].loading = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Product',
              message: err.message,
            });
          },
        });
      },
    });
  }
}
