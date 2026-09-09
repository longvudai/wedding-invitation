import { useState } from 'react'

const THUMB =
  'https://cdn.zenlove.me/templates/ad4d02db-d615-49dc-8a57-1bb8edae8b88/long_ad4d02db-d615-49dc-8a57-1bb8edae8b88.jpg?crop=0,0,804,1440&width=96'

const SECTIONS = [
  ['m3U0s1BrXN', 'Trang chủ'],
  ['mprAcu3sZU', 'Thiệp mời'],
  ['ES20VZOLFE', 'Gia đình'],
  ['ym99iaIx_V', 'Lịch cưới'],
  ['1vSWRWE3RW', 'Sự kiện'],
  ['7vErQdxtwL', 'Lời ngỏ'],
  ['5jFX5GUuTk', 'Xác nhận tham dự'],
  ['hLQHRI5AV-', 'Gửi quà mừng'],
  ['ceF_b9kHwH', 'Album ảnh cưới'],
]

export default function Menu() {
  const [open, setOpen] = useState(false)

  function go(id) {
    setOpen(false)
    const el = document.getElementById('node-' + id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <div className="menu-panel">
          <img
            src={THUMB}
            alt="Thiệp Cưới 83 Pre"
            style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
          />
          {SECTIONS.map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>{label}</button>
          ))}
        </div>
      )}
    </>
  )
}
