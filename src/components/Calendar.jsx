import { useT } from '../i18n.jsx'

const HEART = 'https://cdn-resource.zenlove.me/assets/icons/heart-calendar-none.png'

// September 2026: 30 days, 1st is a Tuesday. Week starts Monday.
const LEADING_BLANKS = 1 // Mon-based index of Sep 1, 2026 (Tuesday)
const CAL_YEAR = 2026
const CAL_MONTH = 9
const EVENT_DAYS = [20]

// Today's date-of-month, only when we're viewing the calendar's own month.
function getToday() {
  const now = new Date()
  if (now.getFullYear() === CAL_YEAR && now.getMonth() + 1 === CAL_MONTH) return now.getDate()
  return null
}

export default function Calendar() {
  const t = useT()
  const WEEKDAYS = t('cal.weekdays')
  const eventLabel = t('cal.eventDay')
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const today = getToday()
  return (
    <div className="calendar">
      <div className="grid weekdays">
        {WEEKDAYS.map((w) => (
          <div className="cell wd" key={w}>{w}</div>
        ))}
      </div>
      <div className="grid days">
        {Array.from({ length: LEADING_BLANKS }).map((_, i) => (
          <div className="cell" key={'b' + i} />
        ))}
        {days.map((d) => {
          const ev = EVENT_DAYS.includes(d)
          const isToday = today === d && !ev
          return (
            <div
              className={'cell' + (ev ? ' event' : '') + (isToday ? ' today' : '')}
              key={d}
              title={ev ? eventLabel : undefined}
            >
              {ev && <img className="heart-date" src={HEART} alt={eventLabel} title={eventLabel} />}
              {isToday && <span className="day-circle" />}
              <span className="num">{d}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
