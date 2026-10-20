export type CreateInviteRequest = {
  email: string
  kind: 'STAFF' | 'COURIER'
  positionId?: string
}
