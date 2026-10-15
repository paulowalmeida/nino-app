import { useEffect } from 'react'

import { useMap } from '@vis.gl/react-google-maps'

import { toRadiusBounds } from '@pages/Settings/utils/toRadiusBounds/toRadiusBounds'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

type FitZoneBoundsProps = {
  center: UnitMapLocation
  radiusKm: number
}

const BOUNDS_PADDING_PX = 16

export const FitZoneBounds = ({ center, radiusKm }: FitZoneBoundsProps) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return
    map.fitBounds(toRadiusBounds(center, radiusKm), BOUNDS_PADDING_PX)
  }, [map, center, radiusKm])

  return null
}
