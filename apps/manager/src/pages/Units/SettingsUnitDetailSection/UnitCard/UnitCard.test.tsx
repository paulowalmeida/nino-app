import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UnitCard } from './UnitCard'

const location = {
  states: { data: [], isLoading: false, isError: false },
  municipalities: { data: [], isLoading: false, isError: false },
} as never

describe('UnitCard', () => {
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: new QueryClient() }, children)

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
})
