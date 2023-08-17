import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '@env';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {}
  getProductCategories() {
    return this.http.get(`${ROOT_API}/admin/product-categories`);
  }
  getProductCategory(id: string) {
    return this.http.get(`${ROOT_API}/admin/product-categories/${id}`);
  }

  addProductCategory(bodyReq: any) {
    return this.http.post(`${ROOT_API}/admin/product-categories`, bodyReq);
  }
  updateProductCategory(id: string, bodyReq: any) {
    return this.http.put(`${ROOT_API}/admin/product-categories/${id}`, bodyReq);
  }
  deleteProductCategory(id: string) {
    return this.http.delete(`${ROOT_API}/admin/product-categories/${id}`);
  }
}
