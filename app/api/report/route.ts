import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plate, brand, color, model_year, location, owner_name, owner_phone, notes } = body

    if (!plate || !location || !owner_name || !owner_phone) {
      return NextResponse.json(
        { error: 'الحقول المطلوبة: رقم اللوحة، المكان، اسم المالك، الهاتف' },
        { status: 400 }
      )
    }

    const normalizedPlate = plate.toUpperCase().trim()

    const { data: existing } = await supabase
      .from('lost_cars')
      .select('id')
      .eq('plate', normalizedPlate)
      .eq('status', 'lost')
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'يوجد بلاغ نشط مسجل لهذه اللوحة بالفعل' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('lost_cars')
      .insert([{ plate: normalizedPlate, brand, color, model_year, location, owner_name, owner_phone, notes, status: 'lost' }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'خطأ في الخادم'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
