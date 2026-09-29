const LEGACY_KEY = 'nino.last-order'
const INDEX_KEY = 'nino.guest-order-index'
const CHANGE_EVENT = 'nino:guest-orders-changed'
const DAY_IN_MS = 24 * 60 * 60 * 1000
const ACTIVE_RETENTION_MS = 30 * DAY_IN_MS
const TERMINAL_RETENTION_MS = 7 * DAY_IN_MS
const TERMINAL_STATUSES = new Set(['DELIVERED', 'COMPLETED', 'CANCELLED'])

export type GuestOrderReference = {
  orderId: string
  token: string
  slug: string
  createdAt: string
  lastSeenEventAt: string | null
  terminalAt: string | null
  expiresAt: string
}

export type LastOrder = GuestOrderReference

type NewGuestOrderReference = Pick<
  GuestOrderReference,
  'orderId' | 'token' | 'slug'
> &
  Partial<Pick<GuestOrderReference, 'createdAt'>>

const expiresAfter = (at: string, retention: number) =>
  new Date(new Date(at).getTime() + retention).toISOString()

const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT))

const persist = (orders: GuestOrderReference[]) => {
  window.localStorage.setItem(INDEX_KEY, JSON.stringify(orders))
  window.localStorage.removeItem(LEGACY_KEY)
  notify()
}

const isReference = (value: unknown): value is GuestOrderReference => {
  if (!value || typeof value !== 'object') return false
  const order = value as Partial<GuestOrderReference>

  return (
    typeof order.orderId === 'string' &&
    typeof order.token === 'string' &&
    typeof order.slug === 'string' &&
    typeof order.createdAt === 'string' &&
    (typeof order.lastSeenEventAt === 'string' ||
      order.lastSeenEventAt === null) &&
    (typeof order.terminalAt === 'string' || order.terminalAt === null) &&
    typeof order.expiresAt === 'string'
  )
}

const readStoredIndex = (): GuestOrderReference[] => {
  const stored = window.localStorage.getItem(INDEX_KEY)
  if (stored) {
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isReference) : []
  }

  const legacy = window.localStorage.getItem(LEGACY_KEY)
  if (!legacy) return []

  const parsed = JSON.parse(legacy) as Partial<GuestOrderReference>
  if (
    typeof parsed.orderId !== 'string' ||
    typeof parsed.token !== 'string' ||
    typeof parsed.slug !== 'string'
  ) {
    return []
  }

  const createdAt = new Date().toISOString()
  const migrated: GuestOrderReference = {
    orderId: parsed.orderId,
    token: parsed.token,
    slug: parsed.slug,
    createdAt,
    lastSeenEventAt: null,
    terminalAt: null,
    expiresAt: expiresAfter(createdAt, ACTIVE_RETENTION_MS),
  }
  persist([migrated])
  return [migrated]
}

export const readGuestOrders = (slug?: string): GuestOrderReference[] => {
  try {
    const now = Date.now()
    const stored = readStoredIndex()
    const current = stored.filter(
      ({ expiresAt }) => new Date(expiresAt).getTime() > now
    )

    if (current.length !== stored.length) persist(current)

    return current
      .filter((order) => !slug || !order.slug || order.slug === slug)
      .sort((left, right) => {
        if (!!left.terminalAt !== !!right.terminalAt) {
          return left.terminalAt ? 1 : -1
        }
        return Date.parse(right.createdAt) - Date.parse(left.createdAt)
      })
  } catch {
    return []
  }
}

export const readGuestOrder = (orderId: string) =>
  readGuestOrders().find((order) => order.orderId === orderId) ?? null

export const readLastOrder = (): LastOrder | null =>
  readGuestOrders()[0] ?? null

export const writeLastOrder = (order: NewGuestOrderReference): void => {
  try {
    const orders = readGuestOrders()
    const existing = orders.find(({ orderId }) => orderId === order.orderId)
    const createdAt =
      order.createdAt ?? existing?.createdAt ?? new Date().toISOString()
    const next: GuestOrderReference = {
      orderId: order.orderId,
      token: order.token,
      slug: order.slug,
      createdAt,
      lastSeenEventAt: existing?.lastSeenEventAt ?? null,
      terminalAt: existing?.terminalAt ?? null,
      expiresAt:
        existing?.expiresAt ?? expiresAfter(createdAt, ACTIVE_RETENTION_MS),
    }

    persist([next, ...orders.filter(({ orderId }) => orderId !== next.orderId)])
  } catch {
    /* o link de acompanhamento já foi mostrado na tela — isto é só bônus */
  }
}

export const recordGuestOrderStatus = (
  orderId: string,
  status: string,
  latestEventAt: string
): void => {
  try {
    const orders = readGuestOrders()
    const current = orders.find((order) => order.orderId === orderId)
    if (!current) return

    const terminalAt = TERMINAL_STATUSES.has(status)
      ? (current.terminalAt ?? latestEventAt)
      : null
    const expiresAt = terminalAt
      ? expiresAfter(terminalAt, TERMINAL_RETENTION_MS)
      : current.expiresAt

    if (terminalAt === current.terminalAt && expiresAt === current.expiresAt) {
      return
    }

    persist(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, terminalAt, expiresAt } : order
      )
    )
  } catch {
    /* a API segue sendo a fonte de verdade */
  }
}

export const markGuestOrderSeen = (
  orderId: string,
  latestEventAt: string
): void => {
  try {
    const orders = readGuestOrders()
    const current = orders.find((order) => order.orderId === orderId)
    if (!current || current.lastSeenEventAt === latestEventAt) return

    persist(
      orders.map((order) =>
        order.orderId === orderId
          ? { ...order, lastSeenEventAt: latestEventAt }
          : order
      )
    )
  } catch {
    /* estado visual pode ser reconstruído pelo timeline */
  }
}

export const subscribeGuestOrders = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === INDEX_KEY || event.key === LEGACY_KEY) listener()
  }

  window.addEventListener(CHANGE_EVENT, listener)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}

export const clearLastOrder = (): void => {
  try {
    window.localStorage.removeItem(INDEX_KEY)
    window.localStorage.removeItem(LEGACY_KEY)
    notify()
  } catch {
    /* nada a limpar se nunca gravou */
  }
}
