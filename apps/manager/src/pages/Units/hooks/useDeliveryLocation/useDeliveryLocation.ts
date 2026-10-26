import { useQuery } from '@tanstack/react-query'

import { LocationService } from '@pages/Units/services/LocationService/LocationService'

export type DeliveryLocationState = { id: number; sigla: string; nome: string }
export type DeliveryMunicipality = { id: number; nome: string }

export const useDeliveryLocation = (state: string, defaultState = '') => {
  const selectedState = state || defaultState

  const states = useQuery({
    queryKey: ['locations', 'states'],
    queryFn: LocationService.listStates,
    staleTime: Infinity,
  })
  const municipalities = useQuery({
    queryKey: ['locations', 'municipalities', selectedState],
    queryFn: () => LocationService.listMunicipalities(selectedState),
    enabled: !!selectedState,
    staleTime: Infinity,
  })

  return { states, municipalities }
}
