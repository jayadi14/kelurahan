export interface UserStaff {
  id: number;
  name: string;
  email: string;
  email_verified_at: any;
  role: number;
  created_at: string;
  updated_at: string;
  role_name: string;
  staff: Staff;
}

export interface Staff {
  user_id: number;
  section_no: string;
  parent_id: any;
  created_at: string;
  updated_at: string;
  parent: any;
  children: Children[];
}

export interface Children {
  user_id: number;
  section_no: string;
  parent_id: number;
  created_at: string;
  updated_at: string;
}
