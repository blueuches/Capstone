// src/types/profile.ts

export type Role = "admin" | "osca_staff" | "barangay_staff" | "senior"

export type BarangayRef = {
  id: string
  name: string
}

export type Profile = {
  id: string
  role: Role

  // Keep it always present; use null when not applicable (admin/osca_staff)
  barangay_id: string | null

  first_name: string
  middle_name: string | null
  last_name: string

  birthdate: string | null
  gender: string | null
  contact_no: string | null

  // Supabase can return relation as an object OR array depending on query/relationship
  barangays?: BarangayRef | BarangayRef[] | null
  created_at: string
}
