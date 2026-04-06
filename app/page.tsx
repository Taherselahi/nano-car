'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ReportTab from '@/components/ReportTab'
import SearchTab from '@/components/SearchTab'

export default function Home() {
  const [tab, setTab] = useState<'report' | 'search'>('report')
  const [stats, setStats] = useState({ lost: 0, found: 0, total: 0 })
  const [toast, setToast] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const { data } = await supabase
      .from('lost_cars')
      .select('status')

    if (data) {
      const lost  = data.filter(r => r.status === 'lost').length
      const found = data.filter(r => r.status === 'found').length
      setStats({ lost, found, total: data.length })
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  return (
    <div className="phone-shell">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="logo-row">
          <div className="logo-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 12l2-6h14l2 6" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
              <rect x="2" y="12" width="20" height="6" rx="2" stroke="#fff" strokeWidth="1.8"/>
              <circle cx="7" cy="20" r="1.8" stroke="#fff" strokeWidth="1.8"/>
              <circle cx="17" cy="20" r="1.8" stroke="#fff" strokeWidth="1.8"/>
              <path d="M9 20h6" stroke="#fff" strokeWidth="1.8"/>
            </svg>
          </div>
          <div className="logo-name">nano<em>car</em></div>
        </div>
        <div className="header-sub">نظام تتبع السيارات المفقودة — موريتانيا</div>
      </header>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="stat-pill">
          <div className="num" style={{ color: '#FF6B6B' }}>{stats.lost}</div>
          <div className="lbl">مفقودة</div>
        </div>
        <div className="stat-pill">
          <div className="num" style={{ color: '#00C853' }}>{stats.found}</div>
          <div className="lbl">استُعيدت</div>
        </div>
        <div className="stat-pill">
          <div className="num" style={{ color: '#fff' }}>{stats.total}</div>
          <div className="lbl">إجمالي</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'report' ? 'active' : ''}`}
          onClick={() => setTab('report')}>
          الإبلاغ عن فقدان
        </button>
        <button className={`tab-btn ${tab === 'search' ? 'active' : ''}`}
          onClick={() => setTab('search')}>
          البحث عن سيارة
        </button>
      </div>

      {/* ── Content ── */}
      <div className="content">
        {tab === 'report'
          ? <ReportTab onSuccess={() => { showToast('✓ تم تسجيل البلاغ بنجاح'); loadStats() }} />
          : <SearchTab />
        }
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'report' ? 'active' : ''}`}
          onClick={() => setTab('report')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={tab === 'report' ? '#00C2FF' : 'rgba(255,255,255,0.35)'}
              strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>إبلاغ</span>
        </button>
        <button className={`nav-item ${tab === 'search' ? 'active' : ''}`}
          onClick={() => setTab('search')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={tab === 'search' ? '#00C2FF' : 'rgba(255,255,255,0.35)'} strokeWidth="2"/>
            <path d="M20 20l-3-3" stroke={tab === 'search' ? '#00C2FF' : 'rgba(255,255,255,0.35)'} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>بحث</span>
        </button>
        <button className="nav-item" onClick={() => alert('قادماً قريباً!')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1z"
              stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
          </svg>
          <span>الرئيسية</span>
        </button>
      </nav>

      {/* ── Toast ── */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
