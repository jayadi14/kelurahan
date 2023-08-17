import { Supplier } from "@features/supplier/interfaces/supplier"

export interface PurchaseReturn {
  type_name: string
  status_name: string
  destination_name: string
  id: number
  supplier_id: number
  purchase_return_no: string
  date: string
  note: string
  type: number
  amount: string
  status: number
  destination: number
  created_at: string
  updated_at: string
  deleted_at: any
  purchase_return_details: PurchaseReturnDetail[]
  supplier: Supplier
}

export interface PurchaseReturnDetail {
  id: number
  purchase_return_id: number
  purchaseable_id: number
  purchaseable_type: string
  quantity: number
  amount: string
  created_at: string
  updated_at: string
}
