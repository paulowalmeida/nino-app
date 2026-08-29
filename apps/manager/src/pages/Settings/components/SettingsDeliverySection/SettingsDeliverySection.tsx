import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'
import { DeliveryMapSkeleton } from '@pages/Settings/skeletons/DeliveryMapSkeleton/DeliveryMapSkeleton'
import { ZoneFormSkeleton } from '@pages/Settings/skeletons/ZoneFormSkeleton/ZoneFormSkeleton'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'

import { DeliveryMap } from './DeliveryMap/DeliveryMap'
import { RemoveZoneModal } from './RemoveZoneModal/RemoveZoneModal'
import { ZoneForm } from './ZoneForm/ZoneForm'
import { ZoneList } from './ZoneList/ZoneList'

import motion from '@styles/motion.module.css'
import local from './SettingsDeliverySection.module.css'

export const SettingsDeliverySection = () => {
  const { delivery } = useSettingsFacade()
  const { zones, isPending } = delivery.query
  const { coordinates, isResolved } = delivery.location
  const { add, edit, toggle, drop } = delivery.mutations
  const [removingZone, setRemovingZone] = useState<DeliveryZone | null>(null)
  const [previewKm, setPreviewKm] = useState<number | null>(null)
  const [focusedZoneId, setFocusedZoneId] = useState<string | null>(null)

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
          A loja entrega em faixas de distância a partir da unidade. Cada faixa
          tem a sua taxa.
        </Text>
      </Box>

      <Box className={local.territory}>
        {isResolved ? (
          <DeliveryMap
            zones={zones}
            coordinates={coordinates}
            previewKm={previewKm}
            focusedZoneId={focusedZoneId}
          />
        ) : (
          <DeliveryMapSkeleton />
        )}
      </Box>

      <Box className={local.split}>
        <Box className={local.rail}>
          {isResolved ? (
            <ZoneForm
              isAdding={add.isPending}
              lastMaxRadiusKm={zones.at(-1)?.maxRadiusKm}
              onAdd={add.mutate}
              onPreviewRadius={setPreviewKm}
            />
          ) : (
            <ZoneFormSkeleton />
          )}
        </Box>

        <Box className={local.zones}>
          <ZoneList
            zones={zones}
            isPending={isPending}
            onEdit={edit.mutate}
            onToggle={toggle.mutate}
            onRemove={setRemovingZone}
            focusedZoneId={focusedZoneId}
            onFocusZone={setFocusedZoneId}
          />
        </Box>
      </Box>

      <RemoveZoneModal
        open={!!removingZone}
        onOpenChange={(open) => !open && setRemovingZone(null)}
        zoneLabel={removingZone ? `até ${removingZone.maxRadiusKm} km` : ''}
        onConfirm={confirmRemoval}
      />
    </Box>
  )
}
