export interface User {
  id: number
  name: string
  email: string
  email_verified_at: any
  role: number
  created_at: string
  updated_at: string
  role_name: string
  civilian: Civilian
}

export interface Civilian {
  user_id: number
  birth_place: string
  birth_date: string
  gender: number
  religion: string
  nik: string
  rt: string
  rw: string
  phone_no: string
  status: number
  approved_by: number
  approved_at: string
  created_at: string
  updated_at: string
  status_name: string
}
