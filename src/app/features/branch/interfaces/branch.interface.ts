import { BusinessUnit } from '@features/company/interfaces/company.interface';

export interface Branch {
  id: number;
  address: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  isExist?: boolean;
  business_units: BusinessUnit;
}
