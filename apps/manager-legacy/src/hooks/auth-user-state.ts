import type { User } from "@nino/lib"

export type AuthUserState = {
  user: User | null
  loading: boolean
}
