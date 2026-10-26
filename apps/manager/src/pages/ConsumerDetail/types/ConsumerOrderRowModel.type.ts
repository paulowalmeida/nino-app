import type { BadgeVariant } from '@nino/ds/components/Badge'

export type ConsumerOrderRowModel = {
  href: string
  number: string
  statusLabel: string
  statusVariant: BadgeVariant
  createdAt: string
  createdAtLabel: string
  total: string
}
