import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandSelectDialogComponent } from '@features/brand/components/brand-select-dialog/brand-select-dialog.component';
import { ProductCategorySelectDialogComponent } from '@features/product-category/components/product-category-select-dialog/product-category-select-dialog.component';
import { ProductService } from '@features/product/services/product.service';
import {
  faCalculator,
  faCheck,
  faChevronDown,
  faCloudArrowUp,
  faPlus,
  faSave,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  // Icons
  faCalculator = faCalculator;
  faPlus = faPlus;
  faTrash = faTrash;
  faCheck = faCheck;
  faCloudArrowUp = faCloudArrowUp;
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

  productForm: FormGroup;
  loading = false;
  selectedCategory: any;
  selectedBrand: any;
  selectedDefaultImage: any;

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
    private dialogService: DialogService,
    private router: Router,
    private fcToastService: FcToastService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Product',
      icon: '',
      showHeader: true,
    });
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      type: new FormControl(0, Validators.required),
      base_price: new FormControl(0, Validators.required),
      status: new FormControl(0, Validators.required),
      valuation_method: new FormControl(0, Validators.required),
      product_category_id: new FormControl('', Validators.required),
      brand_id: new FormControl('', Validators.required),
      // quantity: new FormControl(0, Validators.required),
      product_images: new FormArray([], Validators.required),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  submit() {
    if (this.selectedDefaultImage && this.productForm.valid) {
      let product = this.productForm.value;

      let fd: FormData = new FormData();
      fd.append(`name`, product.name);
      fd.append(`description`, product.description);
      fd.append(`type`, product.type);
      fd.append(`base_price`, product.base_price);
      fd.append(`status`, product.status);
      fd.append(`valuation_method`, product.valuation_method);
      fd.append(`product_category_id`, product.product_category_id);
      fd.append(`brand_id`, product.brand_id);
      // fd.append(`quantity`, product.quantity);
      // Image
      product.product_images.forEach((image: any, i: number) => {
        fd.append(`product_images[${i}][file]`, image.file);
        if (this.selectedDefaultImage == image) {
          fd.append(`product_images[${i}][is_default]`, 'true');
        } else {
          fd.append(`product_images[${i}][is_default]`, 'false');
        }
      });
      this.actionButtons[0].loading = true;
      this.productService.addProduct(fd).subscribe({
        next: (res: any) => {
          this.productForm.reset();
          this.imagesArrayForm.reset();
          this.actionButtons[0].loading = false;
          this.router.navigate(['/product/view/' + res.data.id]);
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
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Product',
        message: 'Fill the form and select default image first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }

  addMultipleImage(images: any) {
    images.forEach((element: any) => {
      (this.productForm.get('product_images') as FormArray).push(
        new FormGroup({
          file: new FormControl(element.file),
          src: new FormControl(element.img_src),
        })
      );
    });
  }

  get imagesArrayForm(): FormArray {
    return this.productForm.get('product_images') as FormArray;
  }

  removeProductImage(image: any, index: number) {
    this.imagesArrayForm.removeAt(index);
    if (image == this.selectedDefaultImage) {
      this.selectedDefaultImage = '';
    }
  }

  onSelectedDefaultImage(image: any) {
    this.selectedDefaultImage = image;
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
          this.selectedCategory.id
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
        this.productForm.controls['brand_id'].setValue(this.selectedBrand.id);
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
}
