import { BusinessUnit } from "@features/company/interfaces/company.interface"
import { Product } from "@features/product/interfaces/product.interface"
import { Supplier } from "@features/supplier/interfaces/supplier"
import { Warehouse } from "@features/warehouse/interfaces/warehouse.interface"

export interface PurchaseOrder {
  status_name: string
  id: number
  purchase_order_no: string
  supplier_id: number
  date: string
  expected_delivery_date: string
  status: number
  subtotal: string
  tax: string
  grandtotal: string
  note: string
  business_unit_id: number
  created_by: number
  approved_at: any
  approved_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  purchase_order_details: PurchaseOrderDetail[]
  supplier: Supplier
  business_unit: BusinessUnit
}

export interface PurchaseOrderDetail {
  status_name: string
  id: number
  quotation_no: string
  supplier_quotation_id: any
  purchase_order_id: number
  product_id: number
  quantity_ordered: number
  remaining_quantity: number
  quantity_received: number
  price_per_unit: string
  total: string
  expected_delivery_date?: string
  status: number
  created_at: string
  updated_at: string
  deleted_at: any
  purchase_order_warehouses: PurchaseOrderWarehouse[]
  product: Product
}

export interface PurchaseOrderWarehouse {
  id: number
  purchase_order_detail_id: number
  warehouse_id: number
  quantity_ordered: number
  quantity_received: number
  created_at: string
  updated_at: string
  warehouse: Warehouse
}
