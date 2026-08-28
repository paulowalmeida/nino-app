import { useEffect, useRef, useState } from 'react'

import L from 'leaflet'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { TenantService } from '@shared/services/tenant/tenant.service'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import type { TenantDetail } from '@shared/types/store/tenant-detail'

import local from './DeliveryMap.module.css'
import 'leaflet/dist/leaflet.css'

type DeliveryMapProps = {
  zones: DeliveryZone[]
  unit?: TenantDetail
}

const DEFAULT_CENTER: L.LatLngExpression = [-15.78, -47.93]
const MAP_ZOOM = 13

export const DeliveryMap = ({ zones, unit }: DeliveryMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layers = useRef<L.LayerGroup | null>(null)
  const [center, setCenter] = useState<L.LatLngExpression>(DEFAULT_CENTER)
  const [hasLocation, setHasLocation] = useState(false)
  const [locationError, setLocationError] = useState(false)

  useEffect(() => {
    let active = true
    if (!unit) return

    void TenantService.getMapLocation(unit.id)
      .then((coordinates) => {
        if (!active) return
        if (!coordinates) {
          setLocationError(true)
          return
        }
        setCenter([coordinates.latitude, coordinates.longitude])
        setHasLocation(true)
        setLocationError(false)
      })
      .catch(() => {
        if (active) setLocationError(true)
      })

    return () => {
      active = false
    }
  }, [unit])

  useEffect(() => {
    if (!mapElement.current || map.current) return

    map.current = L.map(mapElement.current, {
      center: DEFAULT_CENTER,
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
  }, [])

  useEffect(() => {
    if (!map.current) return
    map.current.setView(center, MAP_ZOOM)
  }, [center])

  useEffect(() => {
    if (!map.current || !layers.current) return
    const layerGroup = layers.current
    layerGroup.clearLayers()

    L.circleMarker(center, {
      radius: 7,
      color: 'var(--color-fg-inverse)',
      weight: 3,
      fillColor: 'var(--color-brand)',
      fillOpacity: 1,
    })
      .bindTooltip('Unidade', { direction: 'top' })
      .addTo(layerGroup)

    zones.forEach((zone) => {
      L.circle(center, {
        radius: zone.maxRadiusKm * 1000,
        color: 'var(--color-brand)',
        weight: 2,
        fillColor: 'var(--color-brand)',
        fillOpacity: zone.isActive ? 0.12 : 0.04,
        dashArray: zone.isActive ? undefined : '6 6',
      })
        .bindTooltip(
          `De ${zone.minRadiusKm} até ${zone.maxRadiusKm} km`,
        )
        .addTo(layerGroup)
    })
  }, [center, zones])

  return (
    <Box className={local.wrapper}>
      <Box className={local.header}>
        <Box>
          <Text size="sm" weight="semibold">
            Área de atendimento
          </Text>
          <Text size="xs" color="subtle">
            As faixas configuradas aparecem como círculos no mapa.
          </Text>
        </Box>
        <Text size="xs" color="subtle">
          {hasLocation
            ? 'Endereço da unidade'
            : locationError
              ? 'Não foi possível localizar o endereço'
              : 'Aguardando localização'}
        </Text>
      </Box>
      <div
        ref={mapElement}
        className={local.map}
        role="img"
        aria-label="Mapa das áreas de entrega"
      />
    </Box>
  )
}
