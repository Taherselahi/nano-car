'use client'

import { useState } from 'react'
import { supabase, LostCar } from '@/lib/supabase'

type SearchState = 'idle' | 'loading' | 'found' | 'notfound'

const STATUS_LABELS: Record<string, string> = {
  lost:      'مُبلَّغ عن فقدانها',
  found:     'تم العثور عليها',
  cancelled: 'تم إلغاء البلاغ',
}

export default function SearchTab() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<SearchState>('idle')
  const [result, setResult] = useState<LostCar | null>(null)

  async function search() {
    const q = query.trim().toUpperCase()
    if (!q) return
    setState('loading')

    const { data, error } = await supabase
      .from('lost_cars')
      .select('*')
      .ilike('plate', q)
      .single()

    if (error || !data) {
      setState('notfound')
      setResult(null)
    } else {
      setResult(data as LostCar)
      setState('found')
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') search()
  }

  return (
    <>
      <div className="card">
        <div className="card-heading">
          <div className="accent" style={{ background: '#FF6B6B' }} />
          البحث برقم اللوحة
        </div>

        <div className="tip-box">
          أدخل رقم اللوحة كاملاً للتحقق من وجود بلاغ مسجل في النظام.
        </div>

        <div className="btn-search-row">
          <input
            className="search-input"
            value={query}
            onChange={e => { setQuery(e.target.value); setState('idle') }}
            onKeyDown={handleKey}
            placeholder="مثال: A-1234-MR"
          />
          <button className="btn-search-icon" onClick={search}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
              <path d="M20 20l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {state === 'loading' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <span className="spinner" style={{ borderColor: 'rgba(0,102,255,0.3)', borderTopColor: '#0066FF' }} />
          </div>
        )}
      </div>

      {state === 'found' && result && (
        <div className="result-lost">
          <div className={`result-badge badge-${result.status}`}>
            {result.status === 'lost' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#6D4C00" strokeWidth="2"/>
                <path d="M12 8v5M12 16h.01" stroke="#6D4C00" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            {STATUS_LABELS[result.status]}
          </div>

          <div className="result-plate">{result.plate}</div>

          <div className="info-row">
            <span className="info-key">الماركة / اللون</span>
            <span className="info-val">{[result.brand, result.color].filter(Boolean).join(' — ') || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-key">مكان الضياع</span>
            <span className="info-val">{result.lost_location}</span>
          </div>
          <div className="info-row">
            <span className="info-key">تاريخ البلاغ</span>
            <span className="info-val">{new Date(result.lost_date).toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="info-row">
            <span className="info-key">المالك</span>
            <span className="info-val">{result.owner_name}</span>
          </div>
          {result.notes && (
            <div className="info-row">
              <span className="info-key">ملاحظات</span>
              <span className="info-val" style={{ maxWidth: '55%', textAlign: 'left', direction: 'rtl' }}>{result.notes}</span>
            </div>
          )}

          {result.status === 'lost' && (
            <a href={`tel:${result.owner_phone}`}>
              <button className="call-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1C7 21 3 10 3 5a1 1 0 011-1z"
                    stroke="#fff" strokeWidth="2"/>
                </svg>
                الاتصال بالمالك — {result.owner_phone}
              </button>
            </a>
          )}
        </div>
      )}

      {state === 'notfound' && (
        <div className="result-none">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
            <circle cx="11" cy="11" r="7" stroke="#BEC5DA" strokeWidth="1.5"/>
            <path d="M20 20l-3-3" stroke="#BEC5DA" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8.5 11h5M11 8.5v5" stroke="#BEC5DA" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
            لا يوجد بلاغ مسجل
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            لم يتم العثور على سيارة برقم اللوحة <strong>{query.toUpperCase()}</strong><br/>
            تأكد من الرقم وأعد المحاولة
          </div>
        </div>
      )}
    </>
  )
}
