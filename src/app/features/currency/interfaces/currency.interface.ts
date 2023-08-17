export interface Currency {
  id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  exchange_rates: ExchangeRate[];
}

export interface ExchangeRate {
  id: string;
  currency_id: number;
  rate: string;
  date: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}
