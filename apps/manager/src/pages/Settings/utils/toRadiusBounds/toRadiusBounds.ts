import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

const KM_PER_LATITUDE_DEGREE = 111.32

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

export const toRadiusBounds = (
  center: UnitMapLocation,
  radiusKm: number
): google.maps.LatLngBoundsLiteral => {
  const latitudeDelta = radiusKm / KM_PER_LATITUDE_DEGREE
  const longitudeDelta =
    radiusKm / (KM_PER_LATITUDE_DEGREE * Math.cos(toRadians(center.latitude)))

  return {
    north: center.latitude + latitudeDelta,
    south: center.latitude - latitudeDelta,
    east: center.longitude + longitudeDelta,
    west: center.longitude - longitudeDelta,
  }
}
