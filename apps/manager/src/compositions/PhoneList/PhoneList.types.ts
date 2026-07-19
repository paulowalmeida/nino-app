import type { TenantPhone } from '@custom_types/settings'

export type PhoneListProps = {
  phones: TenantPhone[]
  isPending: boolean
  isAdding: boolean
  onAdd: (phone: string) => void
  onRemove: (id: string) => void
}
