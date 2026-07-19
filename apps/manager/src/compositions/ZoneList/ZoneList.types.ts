import type { DeliveryZone } from '@custom_types/settings'

export type ZoneListProps = {
  zones: DeliveryZone[]
  isPending: boolean
  isAdding: boolean
  onAdd: (data: { name: string; fee: number }) => void
  onToggle: (id: string, isActive: boolean) => void
  onRemove: (id: string) => void
}
