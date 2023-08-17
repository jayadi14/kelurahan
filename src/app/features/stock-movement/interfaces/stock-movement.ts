import { Product } from "@features/product/interfaces/product.interface"
import { Warehouse } from "@features/warehouse/interfaces/warehouse.interface"

export interface StockMovement {
  id: number
  product_id: number
  product: Product
  from: Warehouse
  to: Warehouse
  quantity: number
  date: string
  from_id: number
  to_id: number
  note: string
  type: number
  created_at: string
  updated_at: string
  deleted_at: any
}
