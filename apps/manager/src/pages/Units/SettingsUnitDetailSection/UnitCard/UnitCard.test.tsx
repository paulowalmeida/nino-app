import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { UnitDetail } from '@shared/types/store/unit-detail'

import { UnitCard } from './UnitCard'
import { unitCardDetailMock } from './UnitCard.mock'

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

  beforeEach(() => vi.clearAllMocks())

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
        location={location}
        onDeliveryStateChange={() => undefined}
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
        location={location}
        onDeliveryStateChange={() => undefined}
      />,
      { wrapper }
    )
    expect(document.body).toBeTruthy()
  })

  it('separates unit data from store identity', () => {
    render(
      <UnitCard
        unit={undefined}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={() => undefined}
        onSave={() => undefined}
        location={location}
        onDeliveryStateChange={() => undefined}
      />,
      { wrapper }
    )

    expect(screen.getByRole('tab', { name: 'Dados da unidade' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Atendimento' })).toBeTruthy()
    expect(screen.queryByRole('tab', { name: 'Personalizar loja' })).toBeNull()
  })

  it('fills the form with the unit that came from the API', () => {
    renderCard(unitCardDetailMock)

    expect(screen.getByDisplayValue('Loja principal')).toBeInTheDocument()
    expect(screen.getByDisplayValue('loja-principal')).toBeInTheDocument()
  })

  it('keeps the store link out of reach', () => {
    renderCard(unitCardDetailMock)

    expect(screen.getByDisplayValue('loja-principal')).toBeDisabled()
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

  it('opens the visible save action after choosing a delivery city', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCard(unitCardDetailMock)

    await user.click(screen.getByRole('tab', { name: 'Atendimento' }))
    const cityInput = screen.getByRole('combobox', { name: 'Cidade atendida' })
    await user.click(cityInput)
    await user.type(cityInput, 'Ana')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled()
    expect(screen.getByText('Belém · PA')).toBeInTheDocument()
    expect(screen.queryByText('Ananindeua · PA')).not.toBeInTheDocument()
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
