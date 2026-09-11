// Which side is sending the invite, passed via URL, e.g. ?sender=groom
export function getSender() {
  try {
    return (new URLSearchParams(window.location.search).get('sender') || '').trim().toLowerCase()
  } catch {
    return ''
  }
}
