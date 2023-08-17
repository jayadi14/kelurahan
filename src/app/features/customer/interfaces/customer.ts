export interface Customer {
  id: string;
  user_id: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  student: Student;
  guardian: Guardian;
  user: User;
}

export interface Student {
  id: string;
  customer_id: string;
  guardian_id: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export interface Guardian {
  id: string;
  customer_id: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
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
  staff: any;
}
