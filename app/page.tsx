'use client'

import { useState, useEffect } from 'react'

interface WeightRecord {
  id: string
  name: string
  weight: number
  unit: string
  date: string
  notes: string
}

export default function Home() {
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState('kg')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('weightRecords')
    if (saved) {
      setRecords(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('weightRecords', JSON.stringify(records))
  }, [records])

  const addRecord = () => {
    if (!name || !weight) {
      alert('الرجاء إدخال الاسم والوزن')
      return
    }

    const weightNum = parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('الرجاء إدخال وزن صحيح')
      return
    }

    const newRecord: WeightRecord = {
      id: Date.now().toString(),
      name,
      weight: weightNum,
      unit,
      date: new Date().toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      notes
    }

    setRecords([newRecord, ...records])
    setName('')
    setWeight('')
    setNotes('')
  }

  const deleteRecord = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setRecords(records.filter(r => r.id !== id))
    }
  }

  const clearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع السجلات؟')) {
      setRecords([])
    }
  }

  const convertToKg = (weight: number, unit: string): number => {
    switch (unit) {
      case 'g': return weight / 1000
      case 'lb': return weight * 0.453592
      case 'oz': return weight * 0.0283495
      default: return weight
    }
  }

  const totalWeightKg = records.reduce((sum, r) => sum + convertToKg(r.weight, r.unit), 0)
  const averageWeightKg = records.length > 0 ? totalWeightKg / records.length : 0

  const formatWeight = (weight: number): string => {
    return weight.toFixed(6)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>⚖️ تطبيق حساب الأوزان</h1>
        <p>تخزين وحساب الأوزان بدقة عالية</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <div className="input-wrapper">
            <label>اسم العنصر *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: صندوق، منتج، طرد"
            />
          </div>
          <div className="input-wrapper">
            <label>الوزن * (دقة عالية)</label>
            <input
              type="number"
              step="0.000001"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.000000"
            />
          </div>
          <div className="input-wrapper">
            <label>الوحدة</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">كيلوجرام (kg)</option>
              <option value="g">جرام (g)</option>
              <option value="lb">رطل (lb)</option>
              <option value="oz">أونصة (oz)</option>
            </select>
          </div>
        </div>
        <div className="input-wrapper">
          <label>ملاحظات</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي ملاحظات إضافية..."
          />
        </div>
        <div className="button-group">
          <button className="btn btn-primary" onClick={addRecord}>
            ➕ إضافة سجل
          </button>
          <button className="btn btn-secondary" onClick={clearAll}>
            🗑️ حذف الكل
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>إجمالي السجلات</h3>
          <div className="value">{records.length}</div>
          <div className="unit">سجل</div>
        </div>
        <div className="stat-card">
          <h3>الوزن الإجمالي</h3>
          <div className="value">{formatWeight(totalWeightKg)}</div>
          <div className="unit">كجم</div>
        </div>
        <div className="stat-card">
          <h3>متوسط الوزن</h3>
          <div className="value">{formatWeight(averageWeightKg)}</div>
          <div className="unit">كجم</div>
        </div>
      </div>

      <div className="records-section">
        <h2>📋 سجلات الأوزان</h2>
        {records.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>لا توجد سجلات حتى الآن</p>
            <p>ابدأ بإضافة سجل جديد من الأعلى</p>
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>الإجراءات</th>
                <th>ملاحظات</th>
                <th>التاريخ</th>
                <th>الوزن (كجم)</th>
                <th>الوزن</th>
                <th>الاسم</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteRecord(record.id)}
                    >
                      حذف
                    </button>
                  </td>
                  <td>{record.notes || '-'}</td>
                  <td>{record.date}</td>
                  <td>{formatWeight(convertToKg(record.weight, record.unit))}</td>
                  <td>{formatWeight(record.weight)} {record.unit}</td>
                  <td><strong>{record.name}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
