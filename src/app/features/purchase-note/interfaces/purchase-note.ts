import { PurchaseInvoiceDetail } from "@features/purchase-invoice/interfaces/purchase-invoice"
import { Supplier } from "@features/supplier/interfaces/supplier"

export interface PurchaseNote {
  id: number
  supplier_id: number
  type: number
  date: string
  total: string
  note: string
  created_at: string
  updated_at: string
  deleted_at: any
  purchase_note_details: PurchaseNoteDetail[]
  supplier: Supplier
}

export interface PurchaseNoteDetail {
  id: number
  purchase_note_id: number
  purchase_invoice_detail_id: number
  amount: string
  description: string
  created_at: string
  updated_at: string
  purchase_invoice_detail: PurchaseInvoiceDetail
}
