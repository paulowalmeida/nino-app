import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DeliveryCity } from '@shared/types/store/delivery-city'

import { DeliveryCities } from './DeliveryCities'
import {
  deliveryCitiesMock,
  primaryDeliveryCityMock,
} from './DeliveryCities.mock'

const onChange = vi.fn()
const onStateChange = vi.fn()

const location = {
  states: {
    data: [{ id: 15, sigla: 'PA', nome: 'Pará' }],
    isLoading: false,
    isError: false,
  },
  municipalities: {
    data: [
      { id: 1501402, nome: 'Belém' },
      { id: 1500800, nome: 'Ananindeua' },
      { id: 1505536, nome: 'Marituba' },
    ],
    isLoading: false,
    isError: false,
  },
} as never

const renderCities = (cities: DeliveryCity[] = deliveryCitiesMock) =>
  render(
    <DeliveryCities
      cities={cities}
      primaryCity={primaryDeliveryCityMock}
      location={location}
      onStateChange={onStateChange}
      onChange={onChange}
    />
  )

describe('DeliveryCities', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps the unit city and renders configured coverage chips', () => {
    renderCities()

    expect(screen.getByText('Belém · PA')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /Remover Ananindeua, PA/i })
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /cidade da unidade/i })
    ).toBeDisabled()
  })

  it('drops the city the person removed', async () => {
    renderCities()

    await userEvent.click(
      screen.getByRole('button', { name: /Remover Ananindeua, PA/i })
    )

    expect(onChange).toHaveBeenCalledWith([{ city: 'Belém', state: 'PA' }])
  })

  it('reports the state so the cities can be fetched', async () => {
    renderCities()

    await userEvent.click(screen.getByRole('combobox', { name: 'UF' }))
    await userEvent.click(screen.getByRole('option', { name: 'PA' }))

    expect(onStateChange).toHaveBeenCalledWith('PA')
  })

  it('keeps the add button closed while no city is picked', () => {
    renderCities()

    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeDisabled()
  })

})
