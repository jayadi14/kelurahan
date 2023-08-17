import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoryListComponent } from './pages/product-category-list/product-category-list.component';
import { ProductCategoryViewComponent } from './pages/product-category-view/product-category-view.component';
import { ProductCategoryComponent } from './product-category.component';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoryComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ProductCategoryListComponent,
      },
      {
        path: 'view/:id',
        component: ProductCategoryViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCategoryRoutingModule {}
