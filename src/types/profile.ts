export type Profile = {
  id: string
  role: 'admin' | 'osca_staff' | 'barangay_staff' | 'senior'
  barangay_id: string | null
  first_name: string
  middle_name: string | null
  last_name: string
  birthdate: string | null
  gender: string | null
  contact_no: string | null
}
