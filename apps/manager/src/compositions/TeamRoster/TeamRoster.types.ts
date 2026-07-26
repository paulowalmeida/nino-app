export type RosterEntry = {
  id: string
  name: string
  email: string | null
  /** Papel na loja ou situação — o que a pessoa é aqui dentro. */
  role: string
  /** Quiet mark for people who don't operate the panel. */
  quiet?: boolean
  removable: boolean
  /** Whether this entry's e-mail can be edited from the roster. */
  emailEditable?: boolean
}

export type TeamRosterProps = {
  title: string
  hint: string
  entries: RosterEntry[]
  empty: string
  isPending?: boolean
  removingId?: string
  onRemove: (id: string) => void
  onEditEmail?: (id: string) => void
}
