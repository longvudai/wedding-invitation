import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

const SRC = import.meta.env.BASE_URL + 'audio/wedding-theme.mp3'
const ICON = 'https://cdn-resource.zenlove.me/assets/mp3/icons/music-4.png'

export default function AudioToggle() {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const t = useT()

  useEffect(() => {
    const audio = ref.current
    if (!audio) return
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    const stop = () => events.forEach((e) => window.removeEventListener(e, tryPlay))
    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setPlaying(true)
          stop()
        })
        .catch(() => {})
    }
    // Attempt straight away (works only where autoplay is allowed), then fall
    // back to the first user gesture — browsers block audio until then.
    tryPlay()
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }))
    return stop
  }, [])

  function toggle() {
    const audio = ref.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={ref} src={SRC} loop preload="auto" />
      <div
        className={'audio-toggle ' + (playing ? 'playing' : 'paused')}
        onClick={toggle}
        title={t('audio.title')}
      >
        <img src={ICON} alt="music" />
      </div>
    </>
  )
}
