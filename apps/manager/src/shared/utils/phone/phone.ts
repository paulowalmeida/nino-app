/**
 * Brazilian numbers arrive from the API in E.164 (+5591999999999). The panel
 * shows them the way someone reads a number out loud before dialling.
 */
export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  if (digits.length < 10) return phone

  const area = digits.slice(0, 2)
  const rest = digits.slice(2)
  const head = rest.length > 8 ? rest.slice(0, 5) : rest.slice(0, 4)

  return `(${area}) ${head}-${rest.slice(head.length)}`
}

/**
 * Como a API guarda: +55 seguido de DDD e número. Aceita o que a pessoa
 * digitar — com máscara, com 55 na frente ou só os dígitos.
 */
export const toE164 = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  return digits ? `+55${digits}` : ''
}
