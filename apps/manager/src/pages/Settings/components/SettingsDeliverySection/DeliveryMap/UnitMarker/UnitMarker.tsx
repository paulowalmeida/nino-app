import { Marker, useApiIsLoaded } from '@vis.gl/react-google-maps'

import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

type UnitMarkerProps = {
  location: UnitMapLocation
  fillColor: string
  outlineColor: string
}

const MARKER_SCALE = 7
const MARKER_OUTLINE_WEIGHT = 3

export const UnitMarker = ({
  location,
  fillColor,
  outlineColor,
}: UnitMarkerProps) => {
  const isMapsApiLoaded = useApiIsLoaded()

  if (!isMapsApiLoaded) return null

  return (
    <Marker
      position={{ lat: location.latitude, lng: location.longitude }}
      title="Unidade"
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: MARKER_SCALE,
        fillColor,
        fillOpacity: 1,
        strokeColor: outlineColor,
        strokeWeight: MARKER_OUTLINE_WEIGHT,
      }}
    />
  )
}
