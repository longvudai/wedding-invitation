const weddingDate = new Date('2026-09-29T11:00:00+07:00')

const updateCountdown = () => {
  const distance = Math.max(0, weddingDate.getTime() - Date.now())
  const values = {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  }

  Object.entries(values).forEach(([key, value]) => {
    const element = document.querySelector(`[data-time="${key}"]`)
    element.textContent = String(value).padStart(2, '0')
  })
}

updateCountdown()
setInterval(updateCountdown, 1000)

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 },
)

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))

const rsvpForm = document.querySelector('.rsvp-card')
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = new FormData(rsvpForm).get('name')
  rsvpForm.querySelector('.form-status').textContent = `Cảm ơn ${name}! Đại Long và Kim Anh hẹn gặp bạn trong ngày vui của chúng mình.`
  rsvpForm.reset()
})

const dialog = document.querySelector('#gift-dialog')
document.querySelector('.envelope').addEventListener('click', () => dialog.showModal())
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close())
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close()
})

document.querySelector('.copy-button').addEventListener('click', async (event) => {
  await navigator.clipboard.writeText('0123456789')
  event.currentTarget.textContent = 'Đã sao chép'
})
