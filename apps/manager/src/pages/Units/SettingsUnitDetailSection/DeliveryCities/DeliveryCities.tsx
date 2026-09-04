import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Chip } from '@nino/ds/components/Chip'
import { Combobox } from '@nino/ds/components/Combobox'
import { FormField } from '@nino/ds/components/FormField'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import type { DeliveryCity } from '@shared/types/store/delivery-city'
import type { useDeliveryLocation } from '@pages/Units/hooks/useDeliveryLocation/useDeliveryLocation'

import styles from './DeliveryCities.module.css'

type DeliveryCitiesProps = {
  cities: DeliveryCity[]
  primaryCity: DeliveryCity
  location: ReturnType<typeof useDeliveryLocation>
  onStateChange: (state: string) => void
  onChange: (cities: DeliveryCity[]) => void
}

export const DeliveryCities = ({
  cities,
  primaryCity,
  location,
  onStateChange,
  onChange,
}: DeliveryCitiesProps) => {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const { states, municipalities } = location

  const addCity = (selectedCity = city) => {
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
        <FormField label="UF" className={styles.stateField}>
          <Select
            options={(states.data ?? []).map(({ sigla }) => ({
              value: sigla,
              label: sigla,
            }))}
            value={state}
            onValueChange={(value) => {
              setState(value)
              onStateChange(value)
              setCity('')
            }}
            disabled={states.isLoading || states.isError}
          />
        </FormField>

        <Box grow>
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
              onValueChange={addCity}
              disabled={
                !state || municipalities.isLoading || municipalities.isError
              }
            />
          </FormField>
        </Box>

        <Button
          variant="outline"
          onClick={() => addCity()}
          disabled={
            !municipalities.data?.some(
              (item) => item.nome.toLowerCase() === city.trim().toLowerCase()
            )
          }
        >
          Adicionar
        </Button>
      </Box>

      <Box
        as="ul"
        direction="row"
        gap={2}
        wrap
        aria-label="Cidades configuradas"
      >
        {cities.map((item) => {
          const isPrimary =
            item.city === primaryCity.city && item.state === primaryCity.state
          return (
            <Box as="li" key={`${item.state}-${item.city}`}>
              <Chip
                variant="toggle"
                selected={false}
                trailingIcon={isPrimary ? undefined : '×'}
                disabled={isPrimary}
                aria-label={
                  isPrimary
                    ? `${item.city}, ${item.state}, cidade da unidade`
                    : `Remover ${item.city}, ${item.state}`
                }
                onClick={() => {
                  if (!isPrimary)
                    onChange(cities.filter((cityName) => cityName !== item))
                }}
              >
                {item.city} · {item.state}
              </Chip>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
