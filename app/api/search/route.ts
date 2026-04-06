import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const plate = searchParams.get('plate')?.toUpperCase().trim()

  if (!plate) {
    return NextResponse.json({ error: 'plate مطلوب' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('lost_cars')
    .select('*')
    .eq('plate', plate)
    .order('reported_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data ?? [] })
}
