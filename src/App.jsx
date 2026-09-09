import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import nodes from './nodes.json'
import Countdown from './components/Countdown.jsx'
import Calendar from './components/Calendar.jsx'
import RsvpForm from './components/RsvpForm.jsx'
import GiftBox from './components/GiftBox.jsx'
import AudioToggle from './components/AudioToggle.jsx'
import { LANGS, LANG_LABEL, useLang, useNodeText, useT } from './i18n.jsx'
import { getGuestName } from './guest.js'

const CANVAS_W = 500
const CANVAS_H = 6844
const TOP_PAD = 32

const ANIM_MAP = {
  slideInLeft: 'slideInLeft',
  slideInRight: 'slideInRight',
  slideInUp: 'slideInUp',
  zoomIn: 'zoomIn',
  fadeIn: 'fadeIn',
}

function AnimWrap({ anim, children, style }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    const fallback = setTimeout(() => setVisible(true), 4000)
    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [])
  const cls = 'anim ' + (ANIM_MAP[anim] || 'fadeIn') + (visible ? ' in' : '')
  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  )
}

function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang-switch">
      {LANGS.map((l) => (
        <button
          key={l}
          className={l === lang ? 'active' : ''}
          onClick={() => setLang(l)}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  )
}

function Node({ n }) {
  const t = useT()
  const nodeText = useNodeText()
  const box = {
    position: 'absolute',
    top: n.box.top,
    left: n.box.left,
    width: n.box.width,
    height: n.type === 'rsvp' ? 'auto' : n.box.height,
    zIndex: Number(n.box.zIndex) || 1,
    transform: n.box.transform,
  }

  let inner = null

  if (n.type === 'text') {
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <div
          className="text-inner"
          style={{
            ...n.ts,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          dangerouslySetInnerHTML={{ __html: nodeText(n.id) ?? n.html }}
        />
      </AnimWrap>
    )
  } else if (n.type === 'map') {
    const src =
      'https://www.google.com/maps?q=' + encodeURIComponent(n.query) + '&z=16&output=embed'
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <iframe
          title={t('map.title')}
          src={src}
          style={{ width: '100%', height: '100%', border: 0, borderRadius: 8 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </AnimWrap>
    )
  } else if (n.type === 'photo') {
    inner = (
      <AnimWrap anim={n.anim} style={{ width: '100%', height: '100%' }}>
        <div
          className="photo-bg"
          style={{ backgroundImage: `url(${n.url})`, backgroundSize: n.bgSize || 'cover' }}
        />
      </AnimWrap>
    )
  } else if (n.type === 'svg') {
    inner = (
      <div
        className="node-svg"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(163, 156, 148)',
        }}
        dangerouslySetInnerHTML={{ __html: n.svg }}
      />
    )
  } else if (n.type === 'image') {
    inner = null // calendar-container handled below
  } else if (n.type === 'calendar') {
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <Calendar />
      </AnimWrap>
    )
  } else if (n.type === 'countdown') {
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <Countdown />
      </AnimWrap>
    )
  } else if (n.type === 'rsvp') {
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <RsvpForm />
      </AnimWrap>
    )
  } else if (n.type === 'giftbox') {
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <GiftBox url={n.url} />
      </AnimWrap>
    )
  } else if (n.type === 'guestname') {
    inner = (
      <AnimWrap anim="fadeIn" style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontSize: 32,
            fontFamily: '"Loving Ambros"',
            lineHeight: 1.6,
          }}
        >
          {getGuestName() || nodeText(n.id) || 'Gia đình anh An'}
        </div>
      </AnimWrap>
    )
  }

  return (
    <div id={'node-' + n.id} className="node" style={box}>
      {inner}
    </div>
  )
}

export default function App() {
  const stageRef = useRef(null)
  const [scale, setScale] = useState(1)
  const t = useT()

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / CANVAS_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      className="stage"
      ref={stageRef}
      style={{ height: CANVAS_H * scale + TOP_PAD, paddingTop: TOP_PAD }}
    >
      <AudioToggle />
      <LangSwitch />
      <button
        className="rsvp-fab"
        onClick={() => {
          const el = document.getElementById('node-5jFX5GUuTk')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        ✎ {t('fab.rsvp')}
      </button>
      <div className="canvas" style={{ transform: `scale(${scale})` }}>
        {nodes.map((n) => (
          <Node key={n.id} n={n} />
        ))}
      </div>
    </div>
  )
}
