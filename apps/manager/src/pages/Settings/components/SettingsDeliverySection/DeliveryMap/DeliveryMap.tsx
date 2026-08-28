import { useEffect, useRef, useState } from 'react'

import L from 'leaflet'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import type { TenantDetail } from '@shared/types/store/tenant-detail'

import local from './DeliveryMap.module.css'
import 'leaflet/dist/leaflet.css'

type Coordinates = {
  latitude: number
  longitude: number
}

type DeliveryMapProps = {
  zones: DeliveryZone[]
  unit?: TenantDetail
}

const DEFAULT_CENTER: L.LatLngExpression = [-15.78, -47.93]
const MAP_ZOOM = 13

const getZipCoordinates = async (zipCode: string) => {
  const digits = zipCode.replace(/\D/g, '')
  if (digits.length !== 8) return null

  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`)
  if (!response.ok) return null

  const data = (await response.json()) as {
    location?: { coordinates?: { latitude?: string; longitude?: string } }
  }
  const latitude = Number(data.location?.coordinates?.latitude)
  const longitude = Number(data.location?.coordinates?.longitude)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

  return { latitude, longitude }
}

const getAddressCoordinates = async (
  unit: TenantDetail,
): Promise<Coordinates | null> => {
  const query = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    countrycodes: 'br',
    limit: '5',
    q: `${unit.street} ${unit.number}, ${unit.neighborhood}, ${unit.city}, ${unit.state}, ${unit.zipCode}, Brazil`,
  })
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${query.toString()}`,
  )
  if (!response.ok) return null

  const data = (await response.json()) as Array<{
    lat?: string
    lon?: string
    address?: { house_number?: string }
  }>
  const number = unit.number.replace(/\D/g, '')
  const result = data.find(
    (item) => item.address?.house_number?.replace(/\D/g, '') === number,
  )
  const latitude = Number(result?.lat)
  const longitude = Number(result?.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

  return { latitude, longitude }
}

export const DeliveryMap = ({ zones, unit }: DeliveryMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layers = useRef<L.LayerGroup | null>(null)
  const [center, setCenter] = useState<L.LatLngExpression>(DEFAULT_CENTER)
  const [hasLocation, setHasLocation] = useState(false)

  useEffect(() => {
    let active = true
    if (!unit) return

    void getAddressCoordinates(unit)
      .catch(() => null)
      .then((coordinates) => coordinates ?? getZipCoordinates(unit.zipCode))
      .then((coordinates) => {
        if (!active || !coordinates) return
        setCenter([coordinates.latitude, coordinates.longitude])
        setHasLocation(true)
      })
      .catch(() => undefined)

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
          `${zone.name}: ${zone.minRadiusKm}–${zone.maxRadiusKm} km`,
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
          {hasLocation ? 'Endereço da unidade' : 'Aguardando localização'}
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
