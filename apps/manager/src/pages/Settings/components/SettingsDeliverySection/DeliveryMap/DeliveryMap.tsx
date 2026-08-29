import { useEffect, useMemo, useRef } from 'react'

import L from 'leaflet'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import type { TenantMapLocation } from '@shared/types/store/tenant-map-location'

import local from './DeliveryMap.module.css'
import 'leaflet/dist/leaflet.css'

type DeliveryMapProps = {
  zones: DeliveryZone[]
  coordinates: TenantMapLocation | null
  previewKm?: number | null
  focusedZoneId?: string | null
}

const MAP_ZOOM = 13

export const DeliveryMap = ({
  zones,
  coordinates,
  previewKm = null,
  focusedZoneId = null,
}: DeliveryMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layers = useRef<L.LayerGroup | null>(null)
  const center = useMemo<L.LatLngExpression | null>(
    () => (coordinates ? [coordinates.latitude, coordinates.longitude] : null),
    [coordinates]
  )

  useEffect(() => {
    if (!mapElement.current || map.current || !center) return

    map.current = L.map(mapElement.current, {
      center,
      zoom: MAP_ZOOM,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.current)
    layers.current = L.layerGroup().addTo(map.current)

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [center])

  useEffect(() => {
    if (!map.current || !layers.current || !center) return
    const layerGroup = layers.current
    layerGroup.clearLayers()

    L.circleMarker(center, {
      radius: 7,
      weight: 3,
      fillOpacity: 1,
      className: local.unitDot,
    })
      .bindTooltip('Unidade', { direction: 'top' })
      .addTo(layerGroup)

    zones.forEach((zone) => {
      const isFocused = focusedZoneId === zone.id
      L.circle(center, {
        radius: zone.maxRadiusKm * 1000,
        weight: isFocused ? 3 : zone.isActive ? 2 : 1,
        fillOpacity: isFocused ? 0.2 : zone.isActive ? 0.1 : 0.03,
        dashArray: zone.isActive ? undefined : '6 6',
        className: zone.isActive ? local.zoneRing : local.zoneRingOff,
      })
        .bindTooltip(`De ${zone.minRadiusKm} até ${zone.maxRadiusKm} km`)
        .addTo(layerGroup)
    })

    if (previewKm) {
      L.circle(center, {
        radius: previewKm * 1000,
        weight: 2,
        fillOpacity: 0.06,
        dashArray: '4 6',
        className: local.previewRing,
      })
        .bindTooltip(`Nova faixa: até ${previewKm} km`)
        .addTo(layerGroup)
    }

    const outerKm = Math.max(
      previewKm ?? 0,
      ...zones.map((zone) => zone.maxRadiusKm),
      1
    )
    map.current.fitBounds(L.latLng(center).toBounds(outerKm * 1000), {
      padding: [16, 16],
    })
  }, [center, zones, previewKm, focusedZoneId])

  return (
    <Box className={local.wrapper}>
      <Box className={local.header}>
        <Text size="sm" weight="semibold">
          Área de atendimento
        </Text>
      </Box>

      {center ? (
        <Box className={local.frame}>
          <div
            ref={mapElement}
            className={local.map}
            role="img"
            aria-label="Mapa das áreas de entrega"
          />
        </Box>
      ) : (
        <Box className={local.error}>
          <Text size="sm" color="subtle">
            Não foi possível localizar o endereço da unidade. O mapa não está
            disponível.
          </Text>
        </Box>
      )}
    </Box>
  )
}
