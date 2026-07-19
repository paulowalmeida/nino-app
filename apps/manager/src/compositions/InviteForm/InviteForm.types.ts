import type { CreateInviteRequest } from '@custom_types/team'

/** What the store picks — one list mixing panel roles and courier. */
export type InviteSeat = 'STAFF' | 'MANAGER' | 'COURIER'

export type InviteFormValues = {
  email: string
  seat: InviteSeat
}

export type InviteFormProps = {
  onInvite: (data: CreateInviteRequest) => Promise<unknown>
}
