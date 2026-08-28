import { useEffect, useRef, useState } from 'react'

import L from 'leaflet'

import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
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

const MAP_ZOOM = 13

export const DeliveryMap = ({ zones, unit }: DeliveryMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layers = useRef<L.LayerGroup | null>(null)
  const [center, setCenter] = useState<L.LatLngExpression | null>(null)
  const [hasLocation, setHasLocation] = useState(false)
  const [locationError, setLocationError] = useState(false)

  useEffect(() => {
    let active = true
    setCenter(null)
    setHasLocation(false)
    setLocationError(false)
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
    if (!map.current || !center) return
    map.current.setView(center, MAP_ZOOM)
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
      L.circle(center, {
        radius: zone.maxRadiusKm * 1000,
        weight: zone.isActive ? 2 : 1,
        fillOpacity: zone.isActive ? 0.1 : 0.03,
        dashArray: zone.isActive ? undefined : '6 6',
        className: zone.isActive ? local.zoneRing : local.zoneRingOff,
      })
        .bindTooltip(`De ${zone.minRadiusKm} até ${zone.maxRadiusKm} km`)
        .addTo(layerGroup)
    })
  }, [center, zones])

  return (
    <Box className={local.wrapper}>
      <Box className={local.header}>
        <Text size="sm" weight="semibold">
          Área de atendimento
        </Text>
        <Text size="xs" color="subtle">
          {hasLocation
            ? 'Centrado no endereço da unidade'
            : locationError
              ? 'Endereço não localizado'
              : 'Aguardando localização'}
        </Text>
      </Box>

      {hasLocation && center ? (
        <Box className={local.frame}>
          <div
            ref={mapElement}
            className={local.map}
            role="img"
            aria-label="Mapa das áreas de entrega"
          />
        </Box>
      ) : locationError ? (
        <Box className={local.error}>
          <Text size="sm" color="subtle">
            Não foi possível localizar o endereço da unidade. O mapa não está
            disponível.
          </Text>
        </Box>
      ) : (
        <Skeleton className={local.skeleton} />
      )}
    </Box>
  )
}
