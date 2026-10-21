import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDeliveryLocation } from '@pages/Units/hooks/useDeliveryLocation/useDeliveryLocation'
import { useUnitAddressSearch } from '@pages/Units/hooks/useUnitAddressSearch/useUnitAddressSearch'
import type { UnitDetail } from '@shared/types/store/unit-detail'

import { UnitCard } from './UnitCard'
import { unitCardDetailMock } from './UnitCard.mock'

vi.mock('@pages/Units/hooks/useUnitAddressSearch/useUnitAddressSearch', () => ({
  useUnitAddressSearch: vi.fn(),
}))

vi.mock('@pages/Units/hooks/useDeliveryLocation/useDeliveryLocation', () => ({
  useDeliveryLocation: vi.fn(),
}))

const resolveSelectedAddress = vi.fn()

const location = {
  states: {
    data: [{ id: 15, sigla: 'PA', nome: 'Pará' }],
    isLoading: false,
    isError: false,
  },
  municipalities: {
    data: [{ id: 1500800, nome: 'Ananindeua' }],
    isLoading: false,
    isError: false,
  },
} as never

const onSave = vi.fn()
const onSetMain = vi.fn()

describe('UnitCard', () => {
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: new QueryClient() }, children)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDeliveryLocation).mockReturnValue(location)
    vi.mocked(useUnitAddressSearch).mockReturnValue({
      suggestions: [
        {
          placeId: 'place-1',
          description: 'Rua das Flores - Centro, Belém - PA',
          mainText: 'Rua das Flores',
          secondaryText: 'Centro, Belém - PA',
        },
      ],
      isSearching: false,
      resolveSelectedAddress,
      isResolvingSelectedAddress: false,
    })
  })

  const renderCard = (unit: UnitDetail | undefined, isMain = false) =>
    render(
      <UnitCard
        unit={unit}
        isPending={false}
        isSaving={false}
        isMain={isMain}
        isPromoting={false}
        onSetMain={onSetMain}
        onSave={onSave}
      />,
      { wrapper }
    )

  it('renders its loading state', () => {
    render(
      <UnitCard
        unit={undefined}
        isPending
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={() => undefined}
        onSave={() => undefined}
      />,
      { wrapper }
    )
    expect(document.body).toBeTruthy()
  })

  it('shows the unit data on a single screen, without tabs', () => {
    render(
      <UnitCard
        unit={undefined}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={() => undefined}
        onSave={() => undefined}
      />,
      { wrapper }
    )

    expect(screen.queryByRole('tab')).toBeNull()
    expect(screen.getByText('Endereço da unidade')).toBeInTheDocument()
  })

  it('fills the form with the unit that came from the API', () => {
    renderCard(unitCardDetailMock)

    expect(screen.getByDisplayValue('Loja principal')).toBeInTheDocument()
    expect(screen.getByDisplayValue('loja-principal')).toBeInTheDocument()
    expect(screen.getByText('loja-principal.localhost:3002')).toBeInTheDocument()
    expect(screen.queryByText('http://')).not.toBeInTheDocument()
  })

  it('shows the store slug as read-only', () => {
    renderCard(unitCardDetailMock)

    const storeSlug = screen.getByDisplayValue('loja-principal')
    expect(storeSlug).toHaveAttribute('readonly')
    expect(storeSlug).not.toBeDisabled()
  })

  it('saves the renamed unit', async () => {
    renderCard(unitCardDetailMock)

    const name = screen.getByDisplayValue('Loja principal')
    await userEvent.clear(name)
    await userEvent.type(name, 'Centro')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ customName: 'Centro' })
    )
  })

  it('keeps the save closed while nothing changed', () => {
    renderCard(unitCardDetailMock)

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })

  it('requires a state before enabling city and address fields', () => {
    renderCard(undefined)

    expect(screen.getByRole('combobox', { name: 'Estado' })).toBeEnabled()
    expect(screen.getByRole('combobox', { name: 'Cidade' })).toBeDisabled()
    expect(screen.getByLabelText('CEP')).toBeDisabled()
    expect(screen.getByLabelText('Endereço')).toBeDisabled()
  })

  it('fills the unit address from a selected autocomplete suggestion', async () => {
    resolveSelectedAddress.mockResolvedValue({
      zipCode: '66000-000',
      street: 'Rua das Flores',
      number: '26',
      neighborhood: 'Centro',
      city: 'Belém',
      state: 'PA',
    })
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCard({ ...unitCardDetailMock, street: '', number: '' })

    const street = screen.getByLabelText('Endereço')
    await user.type(street, 'Rua')
    const number = screen.getByLabelText('Número')
    await user.type(number, '26')
    await user.click(screen.getByText('Endereço da unidade'))
    await user.click(
      screen.getByRole('button', { name: 'Rua das FloresCentro, Belém - PA' })
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('Rua das Flores')).toBeInTheDocument()
      expect(screen.getByDisplayValue('26')).toBeInTheDocument()
      expect(screen.getByDisplayValue('66000-000')).toBeInTheDocument()
    })
    expect(resolveSelectedAddress).toHaveBeenCalledWith('place-1')
  })

  it('shows address suggestions after street and number are completed', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCard({ ...unitCardDetailMock, street: '', number: '' })

    const street = screen.getByLabelText('Endereço')
    await user.type(street, 'Rua')
    const number = screen.getByLabelText('Número')
    await user.type(number, '26')
    await user.click(screen.getByText('Endereço da unidade'))

    expect(await screen.findByText('Confirme o endereço')).toBeInTheDocument()
    expect(screen.getByText('Rua das Flores')).toBeInTheDocument()
    expect(screen.getByText('Centro, Belém - PA')).toBeInTheDocument()
  })

  it('also starts the lookup when number is entered before the street', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCard({ ...unitCardDetailMock, street: '', number: '' })

    const number = screen.getByLabelText('Número')
    await user.type(number, '26')
    const street = screen.getByLabelText('Endereço')
    await user.type(street, 'Rua')
    await user.click(screen.getByText('Endereço da unidade'))

    expect(await screen.findByText('Confirme o endereço')).toBeInTheDocument()
    expect(screen.getByText('Rua das Flores')).toBeInTheDocument()
  })

  it('offers the promotion to a unit that is not the head office', async () => {
    renderCard(unitCardDetailMock)

    await userEvent.click(screen.getByRole('button', { name: 'Tornar matriz' }))

    expect(onSetMain).toHaveBeenCalled()
  })

  it('marks the head office and drops the promotion', () => {
    renderCard(unitCardDetailMock, true)

    expect(screen.getByText('matriz')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Tornar matriz' })
    ).not.toBeInTheDocument()
  })
})
