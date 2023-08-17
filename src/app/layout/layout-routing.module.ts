import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'branch',
        pathMatch: 'full',
      },
      {
        path: 'currency',
        loadChildren: () =>
          import('../features/currency/currency.module').then(
            (m) => m.CurrencyModule
          ),
      },
      {
        path: 'brand',
        loadChildren: () =>
          import('../features/brand/brand.module').then((m) => m.BrandModule),
      },
      {
        path: 'branch',
        loadChildren: () =>
          import('../features/branch/branch.module').then(
            (m) => m.BranchModule
          ),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('../features/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: 'company',
        loadChildren: () =>
          import('../features/company/company.module').then(
            (m) => m.CompanyModule
          ),
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('../features/staff/staff.module').then((m) => m.StaffModule),
      },
      {
        path: 'product',
        loadChildren: () =>
          import('../features/product/product.module').then(
            (m) => m.ProductModule
          ),
      },
      {
        path: 'product-category',
        loadChildren: () =>
          import('../features/product-category/product-category.module').then(
            (m) => m.ProductCategoryModule
          ),
      },
      {
        path: 'template-ui',
        loadChildren: () =>
          import('../features/template-ui/template-ui.module').then(
            (m) => m.TemplateUiModule
          ),
      },
      {
        path: 'warehouse',
        loadChildren: () =>
          import('../features/warehouse/warehouse.module').then(
            (m) => m.WarehouseModule
          ),
      },
      {
        path: 'supplier',
        loadChildren: () =>
          import('../features/supplier/supplier.module').then(
            (m) => m.SupplierModule
          ),
      },
      {
        path: 'purchase-order',
        loadChildren: () =>
          import('../features/purchase-order/purchase-order.module').then(
            (m) => m.PurchaseOrderModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../features/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'chart-of-account',
        loadChildren: () =>
          import('../features/chart-of-account/chart-of-account.module').then(
            (m) => m.ChartOfAccountModule
          ),
      },
      {
        path: 'purchase-invoice',
        loadChildren: () =>
          import('../features/purchase-invoice/purchase-invoice.module').then(
            (m) => m.PurchaseInvoiceModule
          ),
      },
      {
        path: 'supplier-quotation',
        loadChildren: () =>
          import(
            '../features/supplier-quotation/supplier-quotation.module'
          ).then((m) => m.SupplierQuotationModule),
      },
      {
        path: 'purchase-request',
        loadChildren: () =>
          import('../features/purchase-request/purchase-request.module').then(
            (m) => m.PurchaseRequestModule
          ),
      },
      {
        path: 'purchase-payment',
        loadChildren: () =>
          import('../features/purchase-payment/purchase-payment.module').then(
            (m) => m.PurchasePaymentModule
          ),
      },
      {
        path: 'expense',
        loadChildren: () =>
          import('../features/expense/expense.module').then(
            (m) => m.ExpenseModule
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('../features/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: 'purchase-note',
        loadChildren: () =>
          import('../features/purchase-note/purchase-note.module').then(
            (m) => m.PurchaseNoteModule
          ),
      },
      {
        path: 'goods-receipt',
        loadChildren: () =>
          import('../features/goods-receipt/goods-receipt.module').then(
            (m) => m.GoodsReceiptModule
          ),
      },
      {
        path: 'purchase-return',
        loadChildren: () =>
          import('../features/purchase-return/purchase-return.module').then(
            (m) => m.PurchaseReturnModule
          ),
      },
      {
        path: 'stock-movement',
        loadChildren: () =>
          import('../features/stock-movement/stock-movement.module').then(
            (m) => m.StockMovementModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
