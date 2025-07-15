export function openWhatsApp(phone: string | null) {
  if (!phone) return

  const cleanedPhone = phone.replace(/\D/g, '')
  const url = `https://wa.me/${cleanedPhone}`
  window.open(url, '_blank')
}

export function openEmail(email: string | null) {
  if (!email) return

  const url = `mailto:${email}`
  window.open(url, '_blank')
}

export function openTelegram(username: string | null) {
  if (!username) return

  const cleanedUsername = username.replace('@', '')
  const url = `https://t.me/${cleanedUsername}`
  window.open(url, '_blank')
}

export function hasContactInfo(post: {
  contact_whatsapp: string | null
  contact_email: string | null
  contact_telegram: string | null
}) {
  return !!(
    post.contact_whatsapp ||
    post.contact_email ||
    post.contact_telegram
  )
}
