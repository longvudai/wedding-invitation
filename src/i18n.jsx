import { createContext, useCallback, useContext, useState } from 'react'

export const LANGS = ['vi', 'en']
export const LANG_LABEL = { vi: 'VI', en: 'EN' }

// UI strings for components (Vietnamese is the source of truth / fallback).
const STRINGS = {
  vi: {
    'map.title': 'Bản đồ Tiệc cưới',
    'fab.rsvp': 'Xác nhận tham dự',
    'audio.title': 'Nhạc nền',
    'cd.days': 'ngày',
    'cd.hours': 'giờ',
    'cd.minutes': 'phút',
    'cd.seconds': 'giây',
    'cal.weekdays': ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    'cal.eventDay': 'Ngày sự kiện',
    'rsvp.thanksTitle': 'Cảm ơn bạn!',
    'rsvp.thanksSub': 'Xác nhận của bạn đã được ghi nhận.',
    'rsvp.title': 'Xác nhận tham dự',
    'rsvp.sub': 'Rất mong được đón tiếp bạn trong ngày vui của chúng mình',
    'rsvp.nameLabel': 'Họ và tên',
    'rsvp.namePlaceholder': 'Nhập tên của bạn',
    'rsvp.attendLabel': 'Bạn sẽ tham dự chứ?',
    'rsvp.attendYes': 'Có, tôi sẽ tham dự',
    'rsvp.attendNo': 'Tôi bận, rất tiếc không thể tham dự',
    'rsvp.transportLabel': 'Bạn có muốn được đón đưa?',
    'rsvp.transportShuttle': 'Đi xe chung tại SRV Hà Nội',
    'rsvp.transportSelf': 'Mình tự đi',
    'rsvp.submit': 'Gửi xác nhận',
    'gift.title': 'Gửi quà mừng',
    'gift.congrats': 'Chúc mừng hạnh phúc Đại Long & Kim Anh',
    'gift.qrAlt': 'Mã QR chuyển khoản',
    'gift.close': 'Đóng',
  },
  en: {
    'map.title': 'Reception venue map',
    'fab.rsvp': 'RSVP',
    'audio.title': 'Background music',
    'cd.days': 'days',
    'cd.hours': 'hours',
    'cd.minutes': 'minutes',
    'cd.seconds': 'seconds',
    'cal.weekdays': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    'cal.eventDay': 'Event day',
    'rsvp.thanksTitle': 'Thank you!',
    'rsvp.thanksSub': 'Your RSVP has been recorded.',
    'rsvp.title': 'RSVP',
    'rsvp.sub': "We can't wait to celebrate with you on our special day",
    'rsvp.nameLabel': 'Full name',
    'rsvp.namePlaceholder': 'Enter your name',
    'rsvp.attendLabel': 'Will you attend?',
    'rsvp.attendYes': "Yes, I'll be there",
    'rsvp.attendNo': "Sorry, I can't make it",
    'rsvp.transportLabel': 'Would you like a ride?',
    'rsvp.transportShuttle': 'Shuttle from SRV Hà Nội',
    'rsvp.transportSelf': "I'll get there myself",
    'rsvp.submit': 'Send RSVP',
    'gift.title': 'Send a Gift',
    'gift.congrats': 'Congratulations to Dai Long & Kim Anh',
    'gift.qrAlt': 'Bank transfer QR code',
    'gift.close': 'Close',
  },
}

// Per-language overrides for text/guestname nodes, keyed by node id.
// Vietnamese is omitted — it falls back to the html in nodes.json.
const NODE_TEXT = {
  en: {
    Y1tswAfxGk: 'Dai Long  &  Kim Anh',
    mprAcu3sZU: 'Wedding Invitation',
    wvHKk9RG_U: 'The family of Mr. An',
    PQKcTKgQbU: 'Join the wedding of Dai Long & Kim Anh',
    ES20VZOLFE: 'Groom: Dai Long',
    'l4sSuruIS-': 'Mother: Diep Thi Thuy',
    ShXr8wTUdi: 'Father: Trinh Quoc Thai',
    NR2k2JFynI: 'Bride: Kim Anh',
    lXbJZa6YIW: 'Mother: Do Thi Van',
    HU66eG5WEL: "We're getting married!",
    ym99iaIx_V: 'September',
    PsoT5xzJCl: 'at 4:00 PM',
    t6i3Xna9vb: 'Sunday, September 20, 2026',
    cZMC7eRfd_: '', // lunar date hidden in English
    nJZYabmgr5: 'Trong Dong Palace',
    iuQetqXJ_O: '586 Cach Mang Thang 8 St., Gia Sang, Thai Nguyen',
    rQVlHax2HM: 'Wedding Reception',
    '7vErQdxtwL': 'our message',
    XRgYQn3B6T:
      '<div>Your presence is the most precious gift</div><div>we could ask for.</div><br/><div>We know how busy life can be,</div><div>and it means so much to us</div><div>that you have taken the time to share</div><div>in our joy and celebrate this new chapter with us.</div><br/><div>Having you here makes our special day</div><div>even more meaningful and our happiness</div><div>truly complete.</div>',
    '5jFX5GUuTk': 'rsvp',
    'hLQHRI5AV-': 'send a gift',
    ceF_b9kHwH: 'wedding album',
  },
}

// An explicit ?lang=en / ?lang=vi query param overrides everything else.
function langFromUrl() {
  try {
    const l = new URLSearchParams(window.location.search).get('lang')?.toLowerCase()
    if (LANGS.includes(l)) return l
  } catch {}
  return null
}

// Pick the initial language from the browser's locale (Vietnamese speakers get
// Vietnamese, everyone else gets English).
function detectLang() {
  try {
    const locales = navigator.languages?.length
      ? navigator.languages
      : [navigator.language]
    for (const loc of locales) {
      const code = String(loc).toLowerCase().split('-')[0]
      if (LANGS.includes(code)) return code
    }
  } catch {}
  return 'en'
}

const LangCtx = createContext({ lang: 'vi', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const urlLang = langFromUrl()
    if (urlLang) return urlLang
    try {
      const s = localStorage.getItem('lang')
      if (LANGS.includes(s)) return s
    } catch {}
    return detectLang()
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {}
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', l)
      window.history.replaceState(null, '', url)
    } catch {}
  }, [])
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export function useLang() {
  return useContext(LangCtx)
}

// Returns a translator for component UI strings.
export function useT() {
  const { lang } = useContext(LangCtx)
  return (key) => STRINGS[lang]?.[key] ?? STRINGS.vi[key] ?? key
}

// Returns a lookup for per-node text overrides (undefined => use nodes.json).
export function useNodeText() {
  const { lang } = useContext(LangCtx)
  return (id) => NODE_TEXT[lang]?.[id]
}
