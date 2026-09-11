import { useState } from 'react'
import { useT } from '../i18n.jsx'
import { getGuestName } from '../guest.js'
import { getSender } from '../sender.js'

const FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSf4hpRt0yEVqfMXCqRUePFqF_9v42xFEUZAoa38MGQfEbo40Q/formResponse'
const GROOM_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSfX3s1U5DQ3k7dtLaQ4H134jBotRqttQImbXREk4RigcULoyg/formResponse'

const ENTRY = {
  name: 'entry.375192134',
  attend: 'entry.215696088',
  transport: 'entry.1774390406',
}

const ATTEND_YES = '💪 Yessss'
const ATTEND_NO = '😞 Rất tiếc, hôm đó mình có công việc riêng mất rùi.'
const TRANSPORT = {
  shuttle: 'Xe chung tại SRV Hà Nội',
  self: 'Tui muốn đi nhanh nên tui đi một mình',
  none: 'Tui say no 😞',
}
const GROOM_TRANSPORT = {
  shuttle: 'Xe Chung tại Capital Palace',
  self: 'Tui muốn đi nhanh nên tui tự đi một mình',
  none: 'Tui say no 😞',
}

export default function RsvpForm() {
  const t = useT()
  const isGroom = getSender() === 'groom'
  const formAction = isGroom ? GROOM_FORM_ACTION : FORM_ACTION
  const transportText = isGroom ? GROOM_TRANSPORT : TRANSPORT
  const [name, setName] = useState(() => getGuestName())
  const [attend, setAttend] = useState('yes')
  const [transport, setTransport] = useState('shuttle')
  const [sent, setSent] = useState(false)

  async function submit(e) {
    e.preventDefault()

    const data = new FormData()
    data.append(ENTRY.name, name)
    data.append(ENTRY.attend, attend === 'yes' ? ATTEND_YES : ATTEND_NO)
    data.append(
      ENTRY.transport,
      attend === 'yes' ? transportText[transport] : transportText.none
    )

    try {
      await fetch(formAction, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
      })
    } catch {
      // no-cors response is opaque; ignore
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rsvp-form">
        <div className="thanks-mark">♡</div>
        <h3>{t('rsvp.thanksTitle')}</h3>
        <p className="sub">{t('rsvp.thanksSub')}</p>
      </div>
    )
  }

  return (
    <div className="rsvp-form">
      <h3>{t('rsvp.title')}</h3>
      <p className="sub">{t('rsvp.sub')}</p>
      <form onSubmit={submit}>
        <div>
          <label className="field-label" htmlFor="rsvp-name">{t('rsvp.nameLabel')}</label>
          <input
            id="rsvp-name"
            type="text"
            placeholder={t('rsvp.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">{t('rsvp.attendLabel')}</label>
          <div className="radios">
            <label>
              <input
                type="radio"
                name="attend"
                checked={attend === 'yes'}
                onChange={() => setAttend('yes')}
              />{' '}
              {t('rsvp.attendYes')}
            </label>
            <label>
              <input
                type="radio"
                name="attend"
                checked={attend === 'no'}
                onChange={() => setAttend('no')}
              />{' '}
              {t('rsvp.attendNo')}
            </label>
          </div>
        </div>
        {attend === 'yes' && (
          <div>
            <label className="field-label" htmlFor="rsvp-transport">
              {t('rsvp.transportLabel')}
            </label>
            <select
              id="rsvp-transport"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            >
              <option value="shuttle">
                {isGroom ? transportText.shuttle : t('rsvp.transportShuttle')}
              </option>
              <option value="self">{t('rsvp.transportSelf')}</option>
            </select>
          </div>
        )}
        <button type="submit">{t('rsvp.submit')}</button>
      </form>
    </div>
  )
}
