import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

const SRC = 'https://cdn-music.zenlove.me/mp3/beautiful-in-white-1761881405497-kate83p5.mp3'
const ICON = 'https://cdn-resource.zenlove.me/assets/mp3/icons/music-4.png'

export default function AudioToggle() {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const t = useT()

  useEffect(() => {
    const audio = ref.current
    if (!audio) return
    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {})
      window.removeEventListener('pointerdown', tryPlay)
    }
    window.addEventListener('pointerdown', tryPlay)
    return () => window.removeEventListener('pointerdown', tryPlay)
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
