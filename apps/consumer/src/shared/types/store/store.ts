import type { StoreTheme } from '@shared/types/store/store-theme'

/** A loja como a vitrine a recebe de `GET /units/slug/:slug`. */
export type Store = {
  id: string
  slug: string
  customName: string | null
  logoUrl: string | null
  primaryColor: string | null
  secondaryColor?: string | null
  tertiaryColor?: string | null
  backgroundColor?: string | null
  textColor?: string | null
  cardColor?: string | null
  borderColor?: string | null
  mutedTextColor?: string | null
  theme?: StoreTheme | null
  isPaused: boolean
  timezone: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  status: { name: string }
  company: { name: string }
}
