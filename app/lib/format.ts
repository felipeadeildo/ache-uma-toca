export function formatPrice(price: number | null) {
  if (!price) return 'A combinar'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatPriceRange(
  minPrice: number | null,
  maxPrice: number | null
) {
  if (!minPrice && !maxPrice) return 'A combinar'
  if (!minPrice) return `Até ${formatPrice(maxPrice)}`
  if (!maxPrice) return `A partir de ${formatPrice(minPrice)}`
  if (minPrice === maxPrice) return formatPrice(minPrice)

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

export function formatPhoneNumber(phone: string | null) {
  if (!phone) return null

  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '')

  // Formata como (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      7
    )}-${cleaned.substring(7)}`
  }

  // Formata como (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      6
    )}-${cleaned.substring(6)}`
  }

  return phone
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
