export interface PurchasePayment {
  id: string;
  supplier_id: string;
  date: string;
  amount_paid: string;
  payment_method: string;
  note: string;
  status: number;
  status_name: string;
  created_by: number;
  purchase_payment_allocations: PurchasePaymentAllocation[];
}

export interface PurchasePaymentAllocation {
  id: string;
  purchase_payment_id: string;
  purchase_invoice_id: string;
  amount: string;
  created_by: number;
}
