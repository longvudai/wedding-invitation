import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../i18n.jsx'
import { getSender } from '../sender.js'

// Thông tin chuyển khoản — thay bằng thông tin thật của bạn
const BANK = {
  name: 'Vietcombank (VND)',
  number: '9396890555',
  holder: 'TRINH THI KIM ANH',
}
const WOORI_BANK = {
  name: 'Woori Bank (KRW)',
  number: '1002-030-192722',
  holder: 'KIM HYO JUN (Group Leader)',
}
const GROOM_BANK = {
  name: 'Vietcombank (VND)',
  number: '0301000407109',
  holder: 'VU DAI LONG',
  qr: import.meta.env.BASE_URL + 'qr/groom.webp',
}

function BankCard({ bank }) {
  const t = useT()
  return (
    <div
      style={{
        flex: '1 1 200px',
        textAlign: bank.qr ? 'center' : 'left',
        background: '#f2f5fb',
        border: '1px solid #dbe4f3',
        borderRadius: 8,
        padding: '12px 14px',
      }}
    >
      {bank.qr && (
        <img src={bank.qr} alt={t('gift.qrAlt')} className="qr" style={{ margin: '0 auto 10px' }} />
      )}
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: '#2f5fa8', textTransform: 'uppercase' }}>
        {bank.name}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#222', margin: '4px 0 2px', fontFamily: 'monospace' }}>
        {bank.number}
      </div>
      <div style={{ fontSize: 13, color: '#666' }}>{bank.holder}</div>
    </div>
  )
}

export default function GiftBox({ url }) {
  const [open, setOpen] = useState(false)
  const t = useT()
  const banks = getSender() === 'groom' ? [GROOM_BANK] : [BANK, WOORI_BANK]
  return (
    <>
      <div
        style={{ width: '100%', height: '100%', cursor: 'pointer', animation: 'wobble 2s ease-in-out infinite' }}
        onClick={() => setOpen(true)}
      >
        <div
          className="photo-bg"
          style={{ backgroundImage: `url(${url})`, backgroundSize: 'contain' }}
        />
      </div>
      {open &&
        createPortal(
          <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
              <h3>{t('gift.title')}</h3>
              <p>{t('gift.congrats')}</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '12px 0' }}>
                {banks.map((bank) => (
                  <BankCard key={bank.number} bank={bank} />
                ))}
              </div>
              <button onClick={() => setOpen(false)}>{t('gift.close')}</button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
