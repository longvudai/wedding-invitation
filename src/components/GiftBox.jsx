import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../i18n.jsx'

// Thông tin chuyển khoản — thay bằng thông tin thật của bạn
const BANK = {
  name: 'Ngân hàng Vietcombank',
  number: '9396890555',
  holder: 'KIM ANH',
}
const QR_SRC = import.meta.env.BASE_URL + 'qr/bride.png'

export default function GiftBox({ url }) {
  const [open, setOpen] = useState(false)
  const t = useT()
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
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{t('gift.title')}</h3>
              <p>{t('gift.congrats')}</p>
              <img className="qr" src={QR_SRC} alt={t('gift.qrAlt')} />
              <p style={{ fontSize: 14, color: '#666' }}>
                {BANK.name}
                <br />
                {BANK.number} • {BANK.holder}
              </p>
              <button onClick={() => setOpen(false)}>{t('gift.close')}</button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
