import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'

import { RemoveZoneModal } from './RemoveZoneModal/RemoveZoneModal'
import { ZoneForm } from './ZoneForm/ZoneForm'
import { ZoneList } from './ZoneList/ZoneList'

import motion from '@styles/motion.module.css'
import local from './SettingsDeliverySection.module.css'

export const SettingsDeliverySection = () => {
  const { delivery } = useSettingsFacade()
  const { zones, isPending } = delivery.query
  const { add, edit, toggle, drop } = delivery.mutations
  const [removingZone, setRemovingZone] = useState<DeliveryZone | null>(null)

  const confirmRemoval = () => {
    if (!removingZone) return
    drop.mutate(removingZone.id)
    setRemovingZone(null)
  }

  return (
    <Box as="section" className={local.panel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">Entrega por região</Heading>
        <Text size="sm" color="subtle" mt={1}>
          Defina onde a loja atende e qual taxa entra em cada pedido.
        </Text>
      </Box>

      <ZoneForm isAdding={add.isPending} onAdd={add.mutate} />
      <ZoneList
        zones={zones}
        isPending={isPending}
        onEdit={edit.mutate}
        onToggle={toggle.mutate}
        onRemove={setRemovingZone}
      />
      <RemoveZoneModal
        open={!!removingZone}
        onOpenChange={(open) => !open && setRemovingZone(null)}
        zoneName={removingZone?.name ?? ''}
        onConfirm={confirmRemoval}
      />
    </Box>
  )
}
