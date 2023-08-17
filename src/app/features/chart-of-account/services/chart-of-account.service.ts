import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ChartOfAccountService {
  constructor(private http: HttpClient) {}

  getChartOfAccounts(
    dataListParameter: DataListParameter = {} as DataListParameter
  ) {
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
    return this.http.get(`${ROOT_API}/admin/chart-of-accounts${param}`);
  }
  getChartOfAccount(id: string) {
    return this.http.get(`${ROOT_API}/admin/chart-of-accounts/${id}`);
  }
  addChartOfAccount(supplier: any) {
    return this.http.post(`${ROOT_API}/admin/chart-of-accounts`, supplier);
  }
  updateChartOfAccount(id: string, supplier: any) {
    return this.http.put(`${ROOT_API}/admin/chart-of-accounts/${id}`, supplier);
  }
  deleteChartOfAccount(id: string) {
    return this.http.delete(`${ROOT_API}/admin/chart-of-accounts/${id}`);
  }
}
