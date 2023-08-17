import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  constructor(private http: HttpClient) {}

  getBrands(dataListParameter: DataListParameter = {} as DataListParameter) {
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
    return this.http.get(`${ROOT_API}/admin/brands${param}`);
  }

  getBrand(brandId: string) {
    return this.http.get(`${ROOT_API}/admin/brands/${brandId}`);
  }

  addBrand(data: any) {
    return this.http.post(`${ROOT_API}/admin/brands`, data);
  }

  updateBrand(brandId: string, data: any) {
    return this.http.put(`${ROOT_API}/admin/brands/${brandId}`, data);
  }

  softDeleteBrand(brandId: string) {
    return this.http.delete(`${ROOT_API}/admin/brands/${brandId}`);
  }
}
