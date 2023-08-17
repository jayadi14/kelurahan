import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class GoodsReceiptService {
  constructor(private http: HttpClient) {}

  getGoodsReceipts(
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
    return this.http.get(`${ROOT_API}/admin/goods-receipts${param}`);
  }

  getGoodsReceipt(id: string) {
    return this.http.get(`${ROOT_API}/admin/goods-receipts/${id}`);
  }

  addGoodsReceipt(goodsReceipt: any) {
    return this.http.post(`${ROOT_API}/admin/goods-receipts`, goodsReceipt);
  }

  updateGoodsReceipt(id: string, goodsReceipt: any) {
    return this.http.put(
      `${ROOT_API}/admin/goods-receipts/${id}`,
      goodsReceipt
    );
  }

  deleteGoodsReceipt(id: string) {
    return this.http.delete(`${ROOT_API}/admin/goods-receipts/${id}`);
  }

  setStatusAsComplete(id:string){
    return this.http.put(`${ROOT_API}/admin/goods-receipts/${id}/complete`, {});
  }

  setStatusAsCancel(id:string){
    return this.http.put(`${ROOT_API}/admin/goods-receipts/${id}/cancel`, {});
  }

  // Goods Receipt Detail
  addGoodsReceiptDetail(id:string, goodsReceiptDetail: any){
    return this.http.post(`${ROOT_API}/admin/goods-receipts/${id}/details`, goodsReceiptDetail);
  }

  updateGoodsReceiptDetail(id:string, goodsReceiptDetailId:string, goodsReceiptDetail: any){
    return this.http.put(`${ROOT_API}/admin/goods-receipts/${id}/details/${goodsReceiptDetailId}`, goodsReceiptDetail);
  }

  deleteGoodsReceiptDetail(id:string, goodsReceiptDetailId:string){
    return this.http.delete(`${ROOT_API}/admin/goods-receipts/${id}/details/${goodsReceiptDetailId}`);
  }
}
