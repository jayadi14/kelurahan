import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(dataListParameter: DataListParameter = {} as DataListParameter) {
    let param = '';
    if (dataListParameter.rows && dataListParameter.page) {
      param = param.concat(
        `?page=${dataListParameter.page}&limit=${dataListParameter.rows}`
      );
    }
    if (dataListParameter.sortBy) {
      param = param.concat('&' + dataListParameter.sortBy);
    }
    if (dataListParameter.filterObj) {
      param = param.concat('&' + dataListParameter.filterObj);
    }

    if (dataListParameter.searchQuery) {
      if (!dataListParameter.sortBy) {
        param = param.concat('?q=' + dataListParameter.searchQuery);
      } else {
        param = param.concat('&q=' + dataListParameter.searchQuery);
      }
    }
    return this.http.get(`${ROOT_API}/admin/products${param}`);
  }
  getProductsByProductCategory(param: string) {
    return this.http.get(`${ROOT_API}/admin/products?${param}`);
  }
  getProduct(id: string) {
    return this.http.get(`${ROOT_API}/admin/products/${id}`);
  }

  addProduct(data: any) {
    return this.http.post(`${ROOT_API}/admin/products`, data);
  }

  updateProduct(productId: string, data: any) {
    return this.http.put(`${ROOT_API}/admin/products/${productId}`, data);
  }

  softDeleteProduct(productId: string) {
    return this.http.delete(`${ROOT_API}/admin/products/${productId}`);
  }

  addProductImage(productId: string, data: any) {
    return this.http.post(
      `${ROOT_API}/admin/products/${productId}/images`,
      data
    );
  }

  updateProductImage(productId: string, data: any) {
    return this.http.put(
      `${ROOT_API}/admin/products/${productId}/images`,
      data
    );
  }

  softDeleteProductImage(productId: string, imageId: string) {
    return this.http.delete(
      `${ROOT_API}/admin/products/${productId}/images/${imageId}`
    );
  }
}
