import { Inventory } from '@features/inventory/interfaces/inventory';
import { Product } from '@features/product/interfaces/product.interface';

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  exist: boolean;
  inventories: Inventory[];
}
