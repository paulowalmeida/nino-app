import { type ReactNode, useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { Combobox } from '@nino/ds/components/Combobox'
import { FormField } from '@nino/ds/components/FormField'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import type { useDeliveryLocation } from '@pages/Units/hooks/useDeliveryLocation/useDeliveryLocation'
import type { DeliveryCity } from '@shared/types/store/delivery-city'

import styles from './DeliveryCities.module.css'

type DeliveryCitiesProps = {
  cities: DeliveryCity[]
  savedCities: DeliveryCity[]
  primaryCity: DeliveryCity
  location: ReturnType<typeof useDeliveryLocation>
  onStateChange: (state: string) => void
  onChange: (cities: DeliveryCity[]) => void
  saveAction?: ReactNode
}

export const DeliveryCities = ({
  cities,
  savedCities,
  primaryCity,
  location,
  onStateChange,
  onChange,
  saveAction,
}: DeliveryCitiesProps) => {
  const [state, setState] = useState(primaryCity.state)
  const [city, setCity] = useState('')
  const { states, municipalities } = location

  const selectCity = (selectedCity: string) => {
    const municipality = municipalities.data?.find(
      (item) => item.nome.toLowerCase() === selectedCity.trim().toLowerCase()
    )
    if (!municipality) return
    const deliveryCity = { city: municipality.nome, state }
    if (
      cities.some(
        (item) =>
          item.city.toLowerCase() === deliveryCity.city.toLowerCase() &&
          item.state === state
      )
    )
      return
    onChange([...cities, deliveryCity])
    setCity('')
  }

  const visibleCities = cities.filter(
    (item) =>
      savedCities.some(
        (saved) =>
          saved.city.toLowerCase() === item.city.toLowerCase() &&
          saved.state === item.state
      )
  )
  const stateNames = new Map(
    (states.data ?? []).map(({ sigla, nome }) => [sigla, nome])
  )

  return (
    <Box direction="column" gap={4}>
      <Box direction="column" gap={1}>
        <Text weight="semibold">Cidades atendidas</Text>
        <Text size="sm" color="subtle">
          A cidade da unidade já é atendida por inteiro. Adicione outras cidades
          quando a unidade cobrir apenas parte delas.
        </Text>
      </Box>

      <Box direction="row" gap={2} align="end" wrap>
        <FormField label="Estado" className={styles.stateField}>
          <Select
            options={(states.data ?? []).map(({ sigla, nome }) => ({
              value: sigla,
              label: nome,
            }))}
            value={state}
            className={styles.stateSelect}
            onValueChange={(value) => {
              setState(value)
              onStateChange(value)
              setCity('')
            }}
            disabled={states.isLoading || states.isError}
          />
        </FormField>

        <Box className={styles.cityField}>
          <FormField label="Cidade">
            <Combobox
              options={(municipalities.data ?? []).map(({ nome }) => ({
                value: nome,
                label: nome,
              }))}
              placeholder="Busque uma cidade"
              ariaLabel="Cidade atendida"
              inputValue={city}
              onInputValueChange={setCity}
              onValueChange={selectCity}
              disabled={
                !state || municipalities.isLoading || municipalities.isError
              }
            />
          </FormField>
        </Box>
        {saveAction}
      </Box>

      <Box
        as="ul"
        direction="row"
        gap={2}
        wrap
        aria-label="Cidades configuradas"
      >
        {visibleCities.map((item) => {
          const isPrimary =
            item.city === primaryCity.city && item.state === primaryCity.state
          const stateName = stateNames.get(item.state) ?? item.state
          return (
            <Box
              as="li"
              key={`${item.state}-${item.city}`}
              className={styles.chipItem}
            >
              <Chip
                variant="toggle"
                selected={false}
                borderless={false}
                className={
                  isPrimary ? styles.primaryChip : styles.removableChip
                }
                disabled={isPrimary}
                aria-label={
                  isPrimary
                    ? `${item.city}, ${stateName}, cidade da unidade`
                    : `Remover ${item.city}, ${stateName}`
                }
                onClick={() => {
                  if (!isPrimary)
                    onChange(cities.filter((cityName) => cityName !== item))
                }}
              >
                {item.city} · {stateName}
              </Chip>
              {!isPrimary && (
                <Badge
                  size="sm"
                  className={styles.removeBadge}
                  aria-hidden="true"
                >
                  ×
                </Badge>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
