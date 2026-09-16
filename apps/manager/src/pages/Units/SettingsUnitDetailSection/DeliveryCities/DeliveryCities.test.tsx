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
      { id: 1505536, nome: 'Marituba' },
      { id: 1501402, nome: 'Belém' },
      { id: 1500800, nome: 'Ananindeua' },
    ],
    isLoading: false,
    isError: false,
  },
} as never

const renderCities = (
  cities: DeliveryCity[] = deliveryCitiesMock,
  primaryCity: DeliveryCity = primaryDeliveryCityMock
) =>
  render(
    <DeliveryCities
      cities={cities}
      savedCities={deliveryCitiesMock}
      primaryCity={primaryCity}
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
    renderCities(deliveryCitiesMock, { city: '', state: '' })

    await userEvent.click(screen.getByRole('combobox', { name: 'UF' }))
    await userEvent.click(screen.getByRole('option', { name: 'PA' }))

    expect(onStateChange).toHaveBeenCalledWith('PA')
  })

  it('keeps the add button closed while no city is picked', () => {
    renderCities()

    expect(
      screen.queryByRole('button', { name: 'Adicionar' })
    ).not.toBeInTheDocument()
  })

  it('keeps a selected city out of the chips until the saved data returns it', async () => {
    const pendingCity = { city: 'Marituba', state: 'PA' }
    const { rerender } = renderCities([...deliveryCitiesMock, pendingCity])

    rerender(
      <DeliveryCities
        cities={[...deliveryCitiesMock, pendingCity]}
        savedCities={deliveryCitiesMock}
        primaryCity={primaryDeliveryCityMock}
        location={location}
        onStateChange={onStateChange}
        onChange={onChange}
      />
    )
    expect(
      screen.queryByRole('button', { name: /Remover Marituba, PA/i })
    ).not.toBeInTheDocument()

    rerender(
      <DeliveryCities
        cities={[...deliveryCitiesMock, pendingCity]}
        savedCities={[...deliveryCitiesMock, pendingCity]}
        primaryCity={primaryDeliveryCityMock}
        location={location}
        onStateChange={onStateChange}
        onChange={onChange}
      />
    )
    expect(
      screen.getByRole('button', { name: /Remover Marituba, PA/i })
    ).toBeInTheDocument()
  })

})
