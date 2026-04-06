'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onSuccess: () => void
}

export default function ReportTab({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    plate: '',
    brand: '',
    color: '',
    year: '',
    lost_location: '',
    lost_date: new Date().toISOString().slice(0, 10),
    owner_name: '',
    owner_phone: '',
    owner_id_num: '',
    notes: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.plate.trim())         e.plate         = 'رقم اللوحة مطلوب'
    if (!form.owner_name.trim())    e.owner_name    = 'اسم المالك مطلوب'
    if (!form.owner_phone.trim())   e.owner_phone   = 'رقم الهاتف مطلوب'
    if (!form.lost_location.trim()) e.lost_location = 'مكان الضياع مطلوب'
    return e
  }

  async function submit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    try {
      const { error } = await supabase.from('lost_cars').insert({
        plate:         form.plate.trim().toUpperCase(),
        brand:         form.brand.trim() || null,
        color:         form.color.trim() || null,
        year:          form.year.trim() || null,
        lost_location: form.lost_location.trim(),
        lost_date:     form.lost_date,
        owner_name:    form.owner_name.trim(),
        owner_phone:   form.owner_phone.trim(),
        owner_id_num:  form.owner_id_num.trim() || null,
        notes:         form.notes.trim() || null,
        status:        'lost',
      })

      if (error) {
        if (error.code === '23505') {
          setErrors({ plate: 'هذا الرقم مسجل مسبقاً' })
        } else {
          alert('خطأ في قاعدة البيانات: ' + error.message)
        }
        return
      }

      // Log event
      await supabase.from('car_events').insert({
        event_type:  'reported',
        description: `تم تسجيل بلاغ عن فقدان لوحة ${form.plate}`,
      })

      setForm({
        plate: '', brand: '', color: '', year: '',
        lost_location: '',
        lost_date: new Date().toISOString().slice(0, 10),
        owner_name: '', owner_phone: '', owner_id_num: '', notes: '',
      })
      onSuccess()

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-heading">
          <div className="accent" />
          بيانات السيارة
        </div>

        <div className="tip-box">
          أدخل معلومات السيارة المفقودة. سيتم تسجيل البلاغ فوراً في قاعدة البيانات.
        </div>

        <div className="field-group">
          <div className="field-label">رقم لوحة السيارة *</div>
          <input className="field-input" value={form.plate}
            onChange={e => set('plate', e.target.value)}
            placeholder="مثال: A-1234-MR"
            style={{ letterSpacing: '1px', fontWeight: 700 }} />
          {errors.plate && <div className="error-msg">{errors.plate}</div>}
        </div>

        <div className="field-row">
          <div className="field-group">
            <div className="field-label">الماركة</div>
            <input className="field-input" value={form.brand}
              onChange={e => set('brand', e.target.value)}
              placeholder="تويوتا، نيسان..." />
          </div>
          <div className="field-group">
            <div className="field-label">اللون</div>
            <input className="field-input" value={form.color}
              onChange={e => set('color', e.target.value)}
              placeholder="أبيض، أسود..." />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <div className="field-label">سنة الصنع</div>
            <input className="field-input" value={form.year}
              onChange={e => set('year', e.target.value)}
              placeholder="2020" />
          </div>
          <div className="field-group">
            <div className="field-label">تاريخ الضياع</div>
            <input className="field-input" type="date" value={form.lost_date}
              onChange={e => set('lost_date', e.target.value)}
              style={{ direction: 'ltr' }} />
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">مكان الضياع *</div>
          <input className="field-input" value={form.lost_location}
            onChange={e => set('lost_location', e.target.value)}
            placeholder="مثال: حي تفرغ زينة، نواكشوط" />
          {errors.lost_location && <div className="error-msg">{errors.lost_location}</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-heading">
          <div className="accent" style={{ background: '#00C853' }} />
          بيانات المالك
        </div>

        <div className="field-group">
          <div className="field-label">اسم المالك *</div>
          <input className="field-input" value={form.owner_name}
            onChange={e => set('owner_name', e.target.value)}
            placeholder="الاسم الكامل" />
          {errors.owner_name && <div className="error-msg">{errors.owner_name}</div>}
        </div>

        <div className="field-row">
          <div className="field-group">
            <div className="field-label">رقم الهاتف *</div>
            <input className="field-input" value={form.owner_phone}
              onChange={e => set('owner_phone', e.target.value)}
              placeholder="+222 xxxxxxxx"
              style={{ direction: 'ltr', textAlign: 'left' }} />
            {errors.owner_phone && <div className="error-msg">{errors.owner_phone}</div>}
          </div>
          <div className="field-group">
            <div className="field-label">رقم الهوية</div>
            <input className="field-input" value={form.owner_id_num}
              onChange={e => set('owner_id_num', e.target.value)}
              placeholder="اختياري" />
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">ملاحظات إضافية</div>
          <textarea className="field-textarea" value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="خدوش، ملصقات، أي مميزات تساعد في التعرف على السيارة..." />
        </div>
      </div>

      <button className="btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="spinner" /> : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            تقديم البلاغ
          </>
        )}
      </button>
    </>
  )
}
