const KEY = 'nino.last-order'

export type LastOrder = {
  orderId: string
  token: string
  slug: string
}

export const readLastOrder = (): LastOrder | null => {
  try {
    const stored = window.localStorage.getItem(KEY)
    return stored ? (JSON.parse(stored) as LastOrder) : null
  } catch {
    return null
  }
}

export const writeLastOrder = (order: LastOrder): void => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    /* o link de acompanhamento já foi mostrado na tela — isto é só bônus */
  }
}

export const clearLastOrder = (): void => {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* nada a limpar se nunca gravou */
  }
}
