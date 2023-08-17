import { Branch } from "@features/branch/interfaces/branch.interface";

export interface Company {
  id: number;
  name: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  branches: Branch[];
  isExist?: boolean;
  showBranches?: boolean;
}

export interface CompanyBranches {
  id: number;
  branch_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export interface BusinessUnit {
  id: number
  branch_id: number
  company_id: number
  created_at: string
  updated_at: string
  deleted_at: any
  company: Company
  branch: Branch
}
