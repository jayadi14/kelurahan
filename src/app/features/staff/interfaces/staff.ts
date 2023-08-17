export interface Staff {
  role_name: string;
  id: string;
  user_id: string;
  note: string;
  role: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  company_branches: any[];
  user: User;
}

export interface User {
  id: string;
  name: string;
  phone_no: string;
  address: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}
