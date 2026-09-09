// Guest name passed via URL, e.g. ?guest=Gia%20đình%20anh%20An
export function getGuestName() {
  try {
    return (new URLSearchParams(window.location.search).get('guest') || '').trim()
  } catch {
    return ''
  }
}
