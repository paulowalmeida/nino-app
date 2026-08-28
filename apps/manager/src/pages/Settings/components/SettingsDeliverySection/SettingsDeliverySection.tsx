import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'

import { DeliveryMap } from './DeliveryMap/DeliveryMap'
import { RemoveZoneModal } from './RemoveZoneModal/RemoveZoneModal'
import { ZoneForm } from './ZoneForm/ZoneForm'
import { ZoneList } from './ZoneList/ZoneList'

import motion from '@styles/motion.module.css'
import local from './SettingsDeliverySection.module.css'

export const SettingsDeliverySection = () => {
  const { delivery, units } = useSettingsFacade()
  const { zones, isPending } = delivery.query
  const unit = units.detail.data
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
        <Heading level={2} size="xl">
          Entrega
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Defina as faixas de distância e o valor de cada uma.
        </Text>
      </Box>

      <DeliveryMap zones={zones} unit={unit} />
      <ZoneForm
        isAdding={add.isPending}
        lastMaxRadiusKm={zones.at(-1)?.maxRadiusKm}
        onAdd={add.mutate}
      />
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
        zoneLabel={removingZone ? `até ${removingZone.maxRadiusKm} km` : ''}
        onConfirm={confirmRemoval}
      />
    </Box>
  )
}
