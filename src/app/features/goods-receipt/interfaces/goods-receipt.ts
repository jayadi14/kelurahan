import { Product } from "@features/product/interfaces/product.interface"
import { PurchaseInvoice } from "@features/purchase-invoice/interfaces/purchase-invoice"
import { Supplier } from "@features/supplier/interfaces/supplier"
import { Warehouse } from "@features/warehouse/interfaces/warehouse.interface"

export interface GoodsReceipt {
  status_name: string
  id: number
  purchase_invoice_id: number
  supplier_id: number
  warehouse_id: number
  date: string
  note: string
  status: number
  created_at: string
  updated_at: string
  goods_receipt_details: GoodsReceiptDetail[]
  warehouse: Warehouse
  supplier: Supplier
  purchase_invoice: PurchaseInvoice
  showDetail: boolean
  goodsReceiptDetailLoaded: boolean
  loading: boolean
}

export interface GoodsReceiptDetail {
  id: number
  goods_receipt_id: number
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
  product: Product
}
