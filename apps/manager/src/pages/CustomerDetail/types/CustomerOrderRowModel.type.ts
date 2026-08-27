import type { BadgeVariant } from '@nino/ds/components/Badge'

export type CustomerOrderRowModel = {
  href: string
  number: string
  statusLabel: string
  statusVariant: BadgeVariant
  createdAt: string
  createdAtLabel: string
  total: string
}
