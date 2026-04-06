import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type LostCar = {
  id: string
  plate: string
  brand: string | null
  color: string | null
  model_year: string | null
  location: string
  owner_name: string
  owner_phone: string
  notes: string | null
  status: 'lost' | 'found' | 'cancelled'
  reported_at: string
  updated_at: string
}

export type ReportFormData = {
  plate: string
  brand: string
  color: string
  model_year: string
  location: string
  owner_name: string
  owner_phone: string
  notes: string
}
