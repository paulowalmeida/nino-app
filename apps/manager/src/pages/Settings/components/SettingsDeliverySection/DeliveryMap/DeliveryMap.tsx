import { useMemo, useState } from 'react'

import { APIProvider, Circle, Map } from '@vis.gl/react-google-maps'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { readColorToken } from '@pages/Settings/utils/readColorToken/readColorToken'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

import { FitZoneBounds } from './FitZoneBounds/FitZoneBounds'
import { UnitMarker } from './UnitMarker/UnitMarker'

import local from './DeliveryMap.module.css'

type DeliveryMapProps = {
  zones: DeliveryZone[]
  coordinates: UnitMapLocation | null
  previewKm?: number | null
  focusedZoneId?: string | null
}

const MAP_ZOOM = 13
const METERS_PER_KM = 1000
const MINIMUM_FIT_RADIUS_KM = 1

const ZONE_RING_STYLE = {
  focused: { strokeWeight: 3, fillOpacity: 0.2 },
  active: { strokeWeight: 2, fillOpacity: 0.1 },
  inactive: { strokeWeight: 1, fillOpacity: 0.03 },
}

const toZoneRingState = (
  zone: DeliveryZone,
  focusedZoneId: string | null
): keyof typeof ZONE_RING_STYLE => {
  if (zone.id === focusedZoneId) return 'focused'
  if (zone.isActive) return 'active'
  return 'inactive'
}

const readMapColors = () => ({
  brand: readColorToken('--color-brand'),
  unitOutline: readColorToken('--color-fg-inverse'),
  preview: readColorToken('--color-accent-clay'),
  inactive: readColorToken('--color-fg-faint'),
})

export const DeliveryMap = ({
  zones,
  coordinates,
  previewKm = null,
  focusedZoneId = null,
}: DeliveryMapProps) => {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined
  const [mapColors] = useState(readMapColors)
  const center = useMemo<google.maps.LatLngLiteral | null>(
    () =>
      coordinates
        ? { lat: coordinates.latitude, lng: coordinates.longitude }
        : null,
    [coordinates]
  )
  const outerRadiusKm = Math.max(
    previewKm ?? 0,
    ...zones.map((zone) => zone.maxRadiusKm),
    MINIMUM_FIT_RADIUS_KM
  )
  const unavailableMessage = coordinates
    ? 'O mapa não está disponível no momento.'
    : 'Não foi possível localizar o endereço da unidade. O mapa não está disponível.'

  return (
    <Box className={local.deliveryMapWrapper}>
      <Box className={local.deliveryMapHeader}>
        <Text size="sm" weight="semibold">
          Área de atendimento
        </Text>
      </Box>

      {coordinates && center && mapsApiKey ? (
        <Box
          className={local.frame}
          role="img"
          aria-label="Mapa das áreas de entrega"
        >
          <APIProvider apiKey={mapsApiKey}>
            <Map
              className={local.map}
              defaultCenter={center}
              defaultZoom={MAP_ZOOM}
              disableDefaultUI
              zoomControl
              gestureHandling="cooperative"
            >
              <FitZoneBounds center={coordinates} radiusKm={outerRadiusKm} />

              {zones.map((zone) => {
                const zoneColor = zone.isActive
                  ? mapColors.brand
                  : mapColors.inactive
                return (
                  <Circle
                    key={zone.id}
                    center={center}
                    radius={zone.maxRadiusKm * METERS_PER_KM}
                    strokeColor={zoneColor}
                    fillColor={zoneColor}
                    clickable={false}
                    {...ZONE_RING_STYLE[toZoneRingState(zone, focusedZoneId)]}
                  />
                )
              })}

              {previewKm ? (
                <Circle
                  center={center}
                  radius={previewKm * METERS_PER_KM}
                  strokeColor={mapColors.preview}
                  fillColor={mapColors.preview}
                  strokeWeight={2}
                  fillOpacity={0.06}
                  clickable={false}
                />
              ) : null}

              <UnitMarker
                location={coordinates}
                fillColor={mapColors.brand}
                outlineColor={mapColors.unitOutline}
              />
            </Map>
          </APIProvider>
        </Box>
      ) : (
        <Box className={local.error}>
          <Text size="sm" color="subtle">
            {unavailableMessage}
          </Text>
        </Box>
      )}
    </Box>
  )
}
