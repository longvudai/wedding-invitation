import { useEffect, useState } from 'react'
import { useT } from '../i18n.jsx'

const TARGET = new Date('2026-09-20T15:30:00+07:00').getTime()
const KEYS = ['cd.days', 'cd.hours', 'cd.minutes', 'cd.seconds']

function diff() {
  const d = Math.max(0, TARGET - Date.now())
  return [
    Math.floor(d / 86400000),
    Math.floor((d / 3600000) % 24),
    Math.floor((d / 60000) % 60),
    Math.floor((d / 1000) % 60),
  ]
}

export default function Countdown() {
  const [t, setT] = useState(diff())
  const tr = useT()
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="countdown">
      {t.map((value, i) => (
        <div className="blk" key={KEYS[i]}>
          <div className="n">{value}</div>
          <div className="l">{tr(KEYS[i])}</div>
        </div>
      ))}
    </div>
  )
}
