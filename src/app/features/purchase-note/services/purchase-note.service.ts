import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class PurchaseNoteService {
  constructor(private http: HttpClient) {}

  getPurchaseNotes(
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
    return this.http.get(`${ROOT_API}/admin/purchase-notes${param}`);
  }

  getPurchaseNote(id: string) {
    return this.http.get(`${ROOT_API}/admin/purchase-notes/${id}`);
  }

  addPurchaseNote(purchaseNote: any) {
    return this.http.post(`${ROOT_API}/admin/purchase-notes`, purchaseNote);
  }

  updatePurchaseNote(id: string, purchaseNote: any) {
    return this.http.put(
      `${ROOT_API}/admin/purchase-notes/${id}`,
      purchaseNote
    );
  }

  deletePurchaseNote(id: string) {
    return this.http.delete(`${ROOT_API}/admin/purchase-notes/${id}`);
  }

  // Purchase Note Detail
  addPurchaseNoteDetail(purchaseNoteId: string, purchaseNoteDetail: any) {
    return this.http.post(`${ROOT_API}/admin/purchase-notes/${purchaseNoteId}/details`, purchaseNoteDetail);
  }

  updatePurchaseNoteDetail(purchaseNoteId: string, purchaseNoteDetailId: string, purchaseNoteDetail: any) {
    return this.http.put(`${ROOT_API}/admin/purchase-notes/${purchaseNoteId}/details/${purchaseNoteDetailId}`, purchaseNoteDetail);
  }

  deletePurchaseNoteDetail(purchaseNoteId: string, purchaseNoteDetailId: string) {
    return this.http.delete(`${ROOT_API}/admin/purchase-notes/${purchaseNoteId}/details/${purchaseNoteDetailId}`);
  }
}
