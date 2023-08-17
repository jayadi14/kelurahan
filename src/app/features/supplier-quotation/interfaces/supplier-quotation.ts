import { Product } from '@features/product/interfaces/product.interface';
import { Supplier } from '@features/supplier/interfaces/supplier';

export interface SupplierQuotation {
  status_name: string;
  id: number;
  supplier_quotation_id: number;
  quotation_no: string;
  supplier_id: number;
  date: string;
  expected_delivery_date: string;
  status: number;
  subtotal: string;
  tax: string;
  grandtotal: string;
  note: any;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  supplier_quotation_details: SupplierQuotationDetail[];
  supplier: Supplier;
  showDetail: boolean;
  supplierQuotationDetailLoaded: boolean;
  loading: boolean;
}
export interface SupplierQuotationDetail {
  id: number;
  supplier_quotation_id: number;
  product_id: number;
  quantity: number;
  price_per_unit: string;
  total: string;
  created_at: string;
  updated_at: string;
  product: Product;
  exist: boolean;
}
