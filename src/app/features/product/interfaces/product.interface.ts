import { Brand } from '@features/brand/interfaces/brand';
import { ProductCategory } from '@features/product-category/interfaces/product-category';

export interface Product {
  type_name: string;
  valuation_method_name: string;
  id: string;
  name: string;
  description: string;
  type: number;
  base_price: string;
  status: number;
  valuation_method: number;
  product_category_id: number;
  brand_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  brand: Brand;
  product_category: ProductCategory;
  product_images: ProductImage[];
  default_image?: ProductImage;
  isExist?: boolean;
}
export interface ProductImage {
  id: number;
  url: string;
  file_path: string;
  is_default: boolean;
  file_type: string;
  sequence: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}
